<template>
	<main class="game-wrap">
		<h1>Minesweeper</h1>

		<section class="hud">
			<p class="status">{{ statusText }}</p>
			<button type="button" @click="addBoard">New Game</button>
		</section>

		<div class="board-container">
			<section v-for="(board, boardId) in boards" :key="boardId" class="board" :style="boardStyle">
				<button v-for="cell in flatBoard(board)" :key="cell.id" class="cell" type="button"
					@click="reveal(boardId, cell.row, cell.col)"
					@contextmenu.prevent="toggleFlag(boardId, cell.row, cell.col)">
					<img :src="cellImage(cell)" alt="cell" draggable="false" />
				</button>
			</section>
		</div>
	</main>
</template>

<script setup>
import { computed, ref } from 'vue'
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

const boards = ref({})
const nextBoardId = ref(0)
const gameOver = ref(false)
const won = ref(false)
const firstMove = ref(true)
const explodedCellId = ref(null)

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
	for (const boardId of Object.keys(boards.value)) {
		computeNeighborMines(boardId)
	}

}

const revealAllMines = (boardId) => {
	for (let row = 0; row < rows; row += 1) {
		for (let col = 0; col < cols; col += 1) {
			const cell = boards.value[boardId][row][col]
			if (cell.mine) {
				cell.revealed = true
			}
		}
	}
}

const floodReveal = (boardId, startRow, startCol) => {
	const stack = [[boardId, startRow, startCol]]

	while (stack.length > 0) {
		const [neighborBoardId, row, col] = stack.pop()
		const cell = boards.value[neighborBoardId][row][col]

		if ((cell.revealed || cell.flagged) && cell.col !== cols - 1) {
			continue
		}

		cell.revealed = true

		if (cell.neighborMines !== 0) {
			continue
		}

		for (const neighbor of neighbors(neighborBoardId, row, col)) {
			if (!neighbor.revealed && !neighbor.mine) {
				stack.push([neighbor.boardId, neighbor.row, neighbor.col])
			}
		}
	}
}

const floodRevealBorderCells = (boardId) => {
	for (let row = 0; row < rows; row += 1) {
		const cell = boards.value[boardId][row][cols - 1]
		if (!cell.mine && cell.revealed && cell.neighborMines === 0) {
			floodReveal(boardId, row, cols - 1)
		}
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
		cell.revealed = true
		explodedCellId.value = cell.id
		revealAllMines(boardId)
		gameOver.value = true
		return
	}

	floodReveal(boardId, row, col)

	if (hasWon(boardId)) {
		won.value = true
	}
}

const toggleFlag = (boardId, row, col) => {
	if (gameOver.value || won.value) {
		return
	}

	const cell = boards.value[boardId][row][col]
	if (cell.revealed) {
		return
	}

	cell.flagged = !cell.flagged
}

const addBoard = () => {
	const newBoardId = createBoard()
	recomputeAllBoardNumbers()
	if (newBoardId > 0) {
		floodRevealBorderCells(newBoardId - 1)
	}
	gameOver.value = false
	won.value = false
	explodedCellId.value = null
}

const addEmptyBoard = () => {
	const boardId = String(nextBoardId.value)
	nextBoardId.value += 1
	boards.value[boardId] = Array.from({ length: rows }, (_, row) =>
		Array.from({ length: cols }, (_, col) => createCell(row, col, boardId)),
	)
	boards.value[boardId].forEach((row) => row.forEach((cell) => (cell.revealed = true)))
}

const addLightBoard = () => {
	const boardId = String(nextBoardId.value)
	nextBoardId.value += 1
	boards.value[boardId] = Array.from({ length: rows }, (_, row) =>
		Array.from({ length: cols }, (_, col) => createCell(row, col, boardId)),
	)
	placeMines(boardId, mineCount / 4)
	computeNeighborMines(boardId)
	floodRevealBorderCells(boardId - 1)
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

	if (cell.neighborMines > 0) {
		return numberImages[cell.neighborMines]
	}

	return cellDownImage
}
const flatBoard = (board) => board.flat()
const statusText = computed(() => {
	if (won.value) {
		return 'You won!'
	}

	if (gameOver.value) {
		return 'Game over'
	}

	return 'Left click to reveal, right click to flag'
})

const boardStyle = computed(() => ({
	gridTemplateColumns: `repeat(${cols}, 2.25rem)`,
}))


const initializeGame = () => {
	addEmptyBoard()
	addEmptyBoard()
	addLightBoard()
	addBoard()
	addBoard()
}

initializeGame()
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
	display: flex;
	gap: 0.2rem;
	overflow-x: hidden;
	justify-content: flex-start;
	align-items: flex-start;
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