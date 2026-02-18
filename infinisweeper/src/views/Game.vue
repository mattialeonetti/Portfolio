<template>
	<main class="game-wrap">
		<h1>Minesweeper</h1>

		<section class="hud">
			<p>Mines: {{ mineCount }}</p>
			<p>Flags: {{ flagCount }}</p>
			<p class="status">{{ statusText }}</p>
			<button type="button" @click="resetGame">New Game</button>
		</section>

		<section class="board" :style="boardStyle">
			<button
				v-for="cell in flatBoard"
				:key="cell.id"
				class="cell"
				type="button"
				@click="reveal(cell.row, cell.col)"
				@contextmenu.prevent="toggleFlag(cell.row, cell.col)"
			>
				<img :src="cellImage(cell)" alt="cell" draggable="false" />
			</button>
		</section>
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
        default: 9,
    },
    cols: {
        type: Number,
        default: 9,
    },
    mineCount: {
        type: Number,
        default: 10,
    },
})

const rows = props.rows
const cols = props.cols
const mineCount = props.mineCount

const board = ref([])
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

const createCell = (row, col) => ({
	id: cellId(row, col),
	row,
	col,
	mine: false,
	revealed: false,
	flagged: false,
	neighborMines: 0,
})

const createBoard = () =>
	Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => createCell(row, col)))

const neighbors = (row, col) => {
	const result = []

	for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
		for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
			if (rowOffset === 0 && colOffset === 0) {
				continue
			}

			const nextRow = row + rowOffset
			const nextCol = col + colOffset

			if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
				result.push(board.value[nextRow][nextCol])
			}
		}
	}

	return result
}

const placeMines = (safeRow, safeCol) => {
	let placed = 0

	while (placed < mineCount) {
		const row = Math.floor(Math.random() * rows)
		const col = Math.floor(Math.random() * cols)
		const cell = board.value[row][col]

		if (cell.mine || (row === safeRow && col === safeCol)) {
			continue
		}

		cell.mine = true
		placed += 1
	}
}

const computeNeighborMines = () => {
	for (let row = 0; row < rows; row += 1) {
		for (let col = 0; col < cols; col += 1) {
			const cell = board.value[row][col]
			if (cell.mine) {
				continue
			}

			cell.neighborMines = neighbors(row, col).filter((neighbor) => neighbor.mine).length
		}
	}
}

const revealAllMines = () => {
	for (let row = 0; row < rows; row += 1) {
		for (let col = 0; col < cols; col += 1) {
			const cell = board.value[row][col]
			if (cell.mine) {
				cell.revealed = true
			}
		}
	}
}

const floodReveal = (startRow, startCol) => {
	const stack = [[startRow, startCol]]

	while (stack.length > 0) {
		const [row, col] = stack.pop()
		const cell = board.value[row][col]

		if (cell.revealed || cell.flagged) {
			continue
		}

		cell.revealed = true

		if (cell.neighborMines !== 0) {
			continue
		}

		for (const neighbor of neighbors(row, col)) {
			if (!neighbor.revealed && !neighbor.mine) {
				stack.push([neighbor.row, neighbor.col])
			}
		}
	}
}

const hasWon = () => {
	for (let row = 0; row < rows; row += 1) {
		for (let col = 0; col < cols; col += 1) {
			const cell = board.value[row][col]
			if (!cell.mine && !cell.revealed) {
				return false
			}
		}
	}

	return true
}

const reveal = (row, col) => {
	if (gameOver.value || won.value) {
		return
	}

	const cell = board.value[row][col]
	if (cell.flagged || cell.revealed) {
		return
	}

	if (firstMove.value) {
		placeMines(row, col)
		computeNeighborMines()
		firstMove.value = false
	}

	if (cell.mine) {
		cell.revealed = true
		explodedCellId.value = cell.id
		revealAllMines()
		gameOver.value = true
		return
	}

	floodReveal(row, col)

	if (hasWon()) {
		won.value = true
	}
}

const toggleFlag = (row, col) => {
	if (gameOver.value || won.value) {
		return
	}

	const cell = board.value[row][col]
	if (cell.revealed) {
		return
	}

	cell.flagged = !cell.flagged
}

const resetGame = () => {
	board.value = createBoard()
	gameOver.value = false
	won.value = false
	firstMove.value = true
	explodedCellId.value = null
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

const flatBoard = computed(() => board.value.flat())
const flagCount = computed(() => flatBoard.value.filter((cell) => cell.flagged).length)
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

resetGame()
</script>

<style scoped>
.game-wrap {
	max-width: 36rem;
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