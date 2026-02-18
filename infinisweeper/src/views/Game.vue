<template>
	<main class="game-wrap">
		<h1>Minesweeper</h1>

		<section class="hud">
			<p class="status">{{ statusText }}</p>
		</section>

		<div ref="boardContainerRef" class="board-container">
			<div class="board-track" :style="boardTrackStyle">
				<section v-for="boardId in boardIds" :key="boardId" class="board" :style="boardStyle">
					<button v-for="cell in flatBoard(boards[boardId])" :key="cell.id" class="cell" type="button"
						@click="reveal(boardId, cell.row, cell.col)"
						@contextmenu.prevent="toggleFlag(boardId, cell.row, cell.col)">
						<img :src="cellImage(cell)" alt="cell" draggable="false" />
					</button>
				</section>
			</div>
		</div>
	</main>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import blastEmptyImage from '../assets/cells/blastempty.svg'
import blastImage from '../assets/cells/blast.svg'
import cell1Image from '../assets/cells/cell1.svg'
import cell2Image from '../assets/cells/cell2.svg'
import cell3Image from '../assets/cells/cell3.svg'
import cell4Image from '../assets/cells/cell4.svg'
import cell5Image from '../assets/cells/cell5.svg'
import cell6Image from '../assets/cells/cell6.svg'
import cell7Image from '../assets/cells/cell7.svg'
import cell8Image from '../assets/cells/cell8.svg'
import cellDownImage from '../assets/cells/celldown.svg'
import cellFlagImage from '../assets/cells/cellflag.svg'
import cellMineImage from '../assets/cells/cellmine.svg'
import cellUpImage from '../assets/cells/cellup.svg'
import falseMineImage from '../assets/cells/falsemine.svg'

const props = defineProps({
	rows: {
		type: Number,
		default: 16,
	},
	cols: {
		type: Number,
		default: 16,
	},
	mineCount: {
		type: Number,
		default: 40,
	},
})

const rows = props.rows
const cols = props.cols
const mineCount = props.mineCount

const boards = ref({}) // collection of boards
const boardIds = ref([]) // ordered list of board IDs for rendering and window management
const nextBoardId = ref(0) // keeps track of next board ID to assign
const gameOver = ref(false) // game over state
const explodedCellId = ref(null) // ID of the cell that caused the game over, used for blast image
const boardContainerRef = ref(null) // ref to the board container for measuring and scrolling
const worldOffsetPx = ref(0) // how far the world has scrolled in pixels
const boardStridePx = ref(0) // how many pixels to scroll before shifting the board window
const lastHiddenCol = ref(0) // the rightmost column index that was hidden on the left

const autoScrollSpeed = 8
const boardBufferCount = 1
let scrollAnimationFrameId = null
let lastFrameTime = null

const numberImages = {
	1: cell1Image,
	2: cell2Image,
	3: cell3Image,
	4: cell4Image,
	5: cell5Image,
	6: cell6Image,
	7: cell7Image,
	8: cell8Image,
}

const cellId = (row, col) => `${row}-${col}`

const createCell = (row, col, boardId) => ({
	id: cellId(row, col),
	row,
	col,
	boardId,
	mine: false,
	revealed: false,
	flagged: false,
	neighborMines: 0,
})

const createBoard = () => {
	const boardId = String(nextBoardId.value)
	nextBoardId.value += 1
	boards.value[boardId] = Array.from({ length: rows }, (_, row) =>
		Array.from({ length: cols }, (_, col) => createCell(row, col, boardId)),
	)
	placeMines(boardId)
	computeNeighborMines(boardId)
	return boardId
}

const neighbors = (boardId, row, col) => {
	const result = []
	const currentBoard = boards.value[boardId]
	const numericBoardId = Number(boardId)
	const leftBoard = boards.value[String(numericBoardId - 1)]
	const rightBoard = boards.value[String(numericBoardId + 1)]

	for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
		const nextRow = row + rowOffset
		if (nextRow < 0 || nextRow >= rows) {
			continue
		}

		for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
			if (rowOffset === 0 && colOffset === 0) {
				continue
			}

			const nextCol = col + colOffset

			if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
				result.push(currentBoard[nextRow][nextCol])
			}
		}

		if (col === 0 && leftBoard) {
			result.push(leftBoard[nextRow][cols - 1])
		}

		if (col === cols - 1 && rightBoard) {
			result.push(rightBoard[nextRow][0])
		}
	}

	return result
}

const placeMines = (boardId, mines = mineCount) => {
	let placed = 0

	while (placed < mines) {
		const row = Math.floor(Math.random() * rows)
		const col = Math.floor(Math.random() * cols)
		const cell = boards.value[boardId][row][col]

		if (cell.mine) {
			continue
		}

		cell.mine = true
		placed += 1
	}
}

const computeNeighborMines = (boardId) => {
	for (let row = 0; row < rows; row += 1) {
		for (let col = 0; col < cols; col += 1) {
			const cell = boards.value[boardId][row][col]
			if (cell.mine) {
				continue
			}

			cell.neighborMines = neighbors(boardId, row, col).filter((neighbor) => neighbor.mine).length
		}
	}
}

const recomputeAllBoardNumbers = () => {
	for (const boardId of boardIds.value) {
		computeNeighborMines(boardId)
	}
}

const revealAllMines = () => {
	for (const boardId of boardIds.value) {
		for (let row = 0; row < rows; row += 1) {
			for (let col = 0; col < cols; col += 1) {
				const cell = boards.value[boardId][row][col]
				if (cell.mine) {
					cell.revealed = true
				}
			}
		}
	}
}

const floodReveal = (boardId, startRow, startCol) => {
	const stack = [[boardId, startRow, startCol]]
	const visited = new Set()

	while (stack.length > 0) {
		const [neighborBoardId, row, col] = stack.pop()
		const visitKey = `${neighborBoardId}:${row}-${col}`
		if (visited.has(visitKey)) {
			continue
		}
		visited.add(visitKey)

		const cell = boards.value[neighborBoardId]?.[row]?.[col]
		if (!cell) {
			continue
		}

		if (cell.flagged || cell.mine) {
			continue
		}

		if (!cell.revealed) {
			cell.revealed = true
		}

		if (cell.neighborMines !== 0) {
			continue
		}

		for (const neighbor of neighbors(neighborBoardId, row, col)) {
			if (!neighbor.mine && !neighbor.flagged) {
				stack.push([neighbor.boardId, neighbor.row, neighbor.col])
			}
		}
	}
}

const floodRevealBorderCells = (boardId) => {
	if (!boards.value[boardId]) {
		return
	}

	for (let row = 0; row < rows; row += 1) {
		const cell = boards.value[boardId][row][cols - 1]
		if (!cell.mine && cell.revealed && cell.neighborMines === 0) {
			floodReveal(boardId, row, cols - 1)
		}
	}
}

const endGame = (cell) => {
	cell.revealed = true
	explodedCellId.value = cell.id
	revealAllMines()
	gameOver.value = true
	if (scrollAnimationFrameId !== null) {
		cancelAnimationFrame(scrollAnimationFrameId)
		scrollAnimationFrameId = null
	}
}

const reveal = (boardId, row, col) => {
	if (gameOver.value) {
		return
	}

	const cell = boards.value[boardId][row][col]
	if (cell.flagged || cell.revealed) {
		return
	}

	if (cell.mine) {
		endGame(cell)
		return
	}

	floodReveal(boardId, row, col)
}

const toggleFlag = (boardId, row, col) => {
	if (gameOver.value) {
		return
	}

	const cell = boards.value[boardId][row][col]
	if (cell.revealed) {
		return
	}

	cell.flagged = !cell.flagged
}

const addEmptyBoard = () => {
	const boardId = String(nextBoardId.value)
	nextBoardId.value += 1
	boards.value[boardId] = Array.from({ length: rows }, (_, row) =>
		Array.from({ length: cols }, (_, col) => createCell(row, col, boardId)),
	)
	boards.value[boardId].forEach((row) => row.forEach((cell) => (cell.revealed = true)))
	boardIds.value.push(boardId)
	return boardId
}

const addLightBoard = () => {
	const boardId = String(nextBoardId.value)
	nextBoardId.value += 1
	boards.value[boardId] = Array.from({ length: rows }, (_, row) =>
		Array.from({ length: cols }, (_, col) => createCell(row, col, boardId)),
	)
	placeMines(boardId, mineCount / 4)
	boardIds.value.push(boardId)
	recomputeAllBoardNumbers()
	const previousBoardId = boardIds.value[boardIds.value.length - 2]
	if (previousBoardId !== undefined) {
		floodRevealBorderCells(previousBoardId)
	}
	return boardId
}

const appendRegularBoard = () => {
	const boardId = createBoard()
	boardIds.value.push(boardId)
	recomputeAllBoardNumbers()
	const previousBoardId = boardIds.value[boardIds.value.length - 2]
	if (previousBoardId !== undefined) {
		floodRevealBorderCells(previousBoardId)
	}
	return boardId
}

const removeLeftmostBoard = () => {
	const removedBoardId = boardIds.value.shift()
	if (removedBoardId === undefined) {
		return
	}

	delete boards.value[removedBoardId]
}

const shiftBoardWindowRight = () => {
	if (boardIds.value.length === 0) {
		return
	}

	removeLeftmostBoard()
	appendRegularBoard()
}

const getFallbackBoardStride = () => {
	const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
	const cellSizeRem = 2.25
	const cellGapRem = 0.2
	const boardGapRem = 0.2
	const boardWidthRem = cols * cellSizeRem + (cols - 1) * cellGapRem
	return (boardWidthRem + boardGapRem) * rootFontSize
}

const updateBoardStride = () => {
	const container = boardContainerRef.value
	if (!container) {
		return
	}

	const firstBoard = container.querySelector('.board')
	if (!firstBoard) {
		boardStridePx.value = getFallbackBoardStride()
		return
	}

	const boardWidth = firstBoard.getBoundingClientRect().width
	const boardTrack = container.querySelector('.board-track')
	if (!boardTrack) {
		boardStridePx.value = getFallbackBoardStride()
		return
	}

	const containerStyles = getComputedStyle(boardTrack)
	const boardGap = Number.parseFloat(containerStyles.gap || '0') || 0
	boardStridePx.value = boardWidth + boardGap
}

const minimumBoardCount = () => {
	const container = boardContainerRef.value
	if (!container || boardStridePx.value <= 0) {
		return 5
	}

	const visibleBoards = Math.max(1, Math.ceil(container.clientWidth / boardStridePx.value))
	console.log('Visible boards:', visibleBoards)
	return visibleBoards + boardBufferCount * 2
}

const ensureBoardWindow = () => {
	const targetCount = minimumBoardCount()
	while (boardIds.value.length < targetCount) {
		appendRegularBoard()
	}
}

const cellImage = (cell) => {
	if (!cell.revealed) {
		if (gameOver.value && cell.flagged && !cell.mine) {
			return falseMineImage
		}

		return cell.flagged ? cellFlagImage : cellUpImage
	}

	if (cell.mine) {
		return cell.id === explodedCellId.value ? blastImage : cellMineImage
	}

	if (cell.id === explodedCellId.value) {
		return blastEmptyImage
	}

	if (cell.neighborMines > 0) {
		return numberImages[cell.neighborMines]
	}

	return cellDownImage
}
const flatBoard = (board) => (board ? board.flat() : [])
const statusText = computed(() => {
	if (gameOver.value) {
		return 'Game over'
	}

	return 'Left click to reveal, right click to flag'
})

const boardStyle = computed(() => ({
	gridTemplateColumns: `repeat(${cols}, 2.25rem)`,
}))

const boardTrackStyle = computed(() => ({
	transform: `translateX(${-worldOffsetPx.value}px)`,
}))


const initializeGame = () => {
	addEmptyBoard()
	while (boardIds.value.length < (minimumBoardCount() - 3) / 2) {
		addEmptyBoard()
	}
	console.log(minimumBoardCount())
	addLightBoard()
	appendRegularBoard()
	appendRegularBoard()
}


const tickScroll = (time) => {
	if (boardStridePx.value <= 0) {
		scrollAnimationFrameId = requestAnimationFrame(tickScroll)
		return
	}

	if (lastFrameTime === null) {
		lastFrameTime = time
	}

	const deltaSeconds = (time - lastFrameTime) / 1000
	lastFrameTime = time
	worldOffsetPx.value += autoScrollSpeed * deltaSeconds

	while (worldOffsetPx.value >= boardStridePx.value) {
		worldOffsetPx.value -= boardStridePx.value
		shiftBoardWindowRight()
	}

	const activelyHidingCol = Math.floor(worldOffsetPx.value / (boardStridePx.value / cols))
	if (activelyHidingCol !== lastHiddenCol.value) {
		lastHiddenCol.value = activelyHidingCol
		for (let row = 0; row < rows; row += 1) {
			const cell = boards.value[boardIds.value[0]]?.[row]?.[activelyHidingCol]
			if (cell && !cell.revealed && !cell.mine) {
				endGame(cell)
				return
			}
		}
	}

	scrollAnimationFrameId = requestAnimationFrame(tickScroll)
}

const handleResize = async () => {
	await nextTick()
	updateBoardStride()
	ensureBoardWindow()
}

onMounted(async () => {
	updateBoardStride()
	initializeGame()
	await nextTick()
	ensureBoardWindow()
	window.addEventListener('resize', handleResize)
	setTimeout(() => {
		scrollAnimationFrameId = requestAnimationFrame(tickScroll)
	}, 5000)
})

onUnmounted(() => {
	window.removeEventListener('resize', handleResize)
	if (scrollAnimationFrameId !== null) {
		cancelAnimationFrame(scrollAnimationFrameId)
		scrollAnimationFrameId = null
	}
	lastFrameTime = null
})
</script>

<style scoped>
.game-wrap {
	max-width: 100vw;
	margin: 2rem auto;
	padding: 1rem;
	font-family: Arial, sans-serif;
}

h1 {
	margin-bottom: 1rem;
}

.hud {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem 1rem;
	align-items: center;
	margin-bottom: 1rem;
}

.hud p {
	margin: 0;
}

.status {
	flex-basis: 100%;
}

.hud button {
	padding: 0.35rem 0.75rem;
	cursor: pointer;
}

.board-container {
	overflow-x: hidden;
	overflow-y: hidden;
	position: relative;
}

.board-track {
	display: flex;
	gap: 0.2rem;
	align-items: flex-start;
	will-change: transform;
}

.board {
	display: grid;
	gap: 0.2rem;
}

.cell {
	width: 2.25rem;
	height: 2.25rem;
	padding: 0;
	border: 0;
	background: transparent;
	line-height: 0;
	cursor: pointer;
}

.cell img {
	width: 100%;
	height: 100%;
	display: block;
}
</style>