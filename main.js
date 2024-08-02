//1. make the price for every weapon
//2. make the achivements

// Stats
let health = 100
let xp = 0
let gold = 50
let monsterHealth
let currentWeaponIndex = 0
let fighting
let inventory = ['stick']
let achivementsInventory = []

// constants
const button1 = document.getElementById('button1')
const button2 = document.getElementById('button2')
const button3 = document.getElementById('button3')
const text = document.getElementById('text')
const xpText = document.getElementById('xpText')
const healthText = document.getElementById('healthText')
const goldText = document.getElementById('goldText')
const monsterName = document.getElementById('monsterName')
const monsterHealthText = document.getElementById('monsterHealth')
const monsterStats = document.getElementById('monsterStats')

// needed lists
const locations = [
	{
		name: 'town square',
		'button text': ['Go to Store', 'Go to Cave', 'Figth Dragon'],
		'button functions': [goStore, goCave, fightDragon],
		text: 'You are in the town square. You see a sign that says "Store".',
	},
	{
		name: 'Store',
		'button text': [
			'Buy 10 health (10 gold)',
			'Buy weapon (30 gold)',
			'Go to town square',
		],
		'button functions': [buyHealth, buyWeapon, goTown],
		text: 'You enter the store.',
	},
	{
		name: 'Cave',
		'button text': ['Fight Slime', 'Fight Beast', 'Go to town square'],
		'button functions': [fightSlime, fightBeast, goTown],
		text: 'You enter the cave. You see some monsters.',
	},
	{
		name: 'fight',
		'button text': ['Attack', 'Dodge', 'Run'],
		'button functions': [attack, dodge, goTown],
		text: 'You are fighting a monster.',
	},
	{
		name: 'monster defeated',
		'button text': [
			'Go to town square',
			'Go to town square',
			'Go to town square',
		],
		'button functions': [goTown, goTown, easterEgg],
		text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
	},
	{
		name: 'winning loc',
		'button text': ['REPLAY?', 'REPLAY?', 'REPLAY?'],
		'button functions': [restart, restart, restart],
		text: 'You defeat the dragon! YOU WIN THE GAME! &#x1F389;',
	},
	{
		name: 'losing loc',
		'button text': ['REPLAY?', 'REPLAY?', 'REPLAY?'],
		'button functions': [restart, restart, restart],
		text: 'You have lost the game. &#x2620;',
	},
	{
		name: 'easter egg',
		'button text': ['pick 2', 'pick 8', 'Go to town square?'],
		'button functions': [pickTwo, pickEight, goTown],
		text: 'You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!',
	},
	{
		name: 'casino',
		'button text': [
			'Go to town square',
			'Go to town square',
			'Go to town square',
		],
		'button functions': [goTown, goTown, goTown],
		text: '',
	},
]

const weapons = [
	{
		name: 'stick',
		power: 5,
	},
	{
		name: 'dagger',
		power: 30,
	},
	{
		name: 'claw hammer',
		power: 50,
	},
	{
		name: 'sword',
		power: 100,
	},
]

const monsters = [
	{
		name: 'Slime',
		level: 2,
		health: 15,
	},
	{
		name: 'Fanged Beast',
		level: 8,
		health: 60,
	},
	{
		name: 'Dragon',
		level: 20,
		health: 300,
	},
]

const achivements = [
	'Won a Slime',
	'Won a beast',
	'Won a dragon',
	'Bought a Dagger weapon',
	'Bought a Claw Hammer weapon',
	'Bought a Sword weapon',
	'Bought a health',
]
//buttons at first screen
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon

//functions
function update(location) {
	monsterStats.style.display = 'none'
	button1.innerText = location['button text'][0]
	button2.innerText = location['button text'][1]
	button3.innerText = location['button text'][2]

	button1.onclick = location['button functions'][0]
	button2.onclick = location['button functions'][1]
	button3.onclick = location['button functions'][2]

	text.innerHTML = location.text
}

function goTown() {
	update(locations[0])
}
//Store functions
function goStore() {
	update(locations[1])
}

function buyHealth() {
	if (gold >= 10) {
		health += 10
		gold -= 10
		healthText.innerText = health
		goldText.innerText = gold
	} else {
		text.innerText = "You haven't got enough gold to buy it"
	}
}

function buyWeapon() {
	if (currentWeaponIndex < weapons.length - 1) {
		if (gold >= 30) {
			currentWeaponIndex++
			gold -= 30
			goldText.innerText = gold
			inventory.push(weapons[currentWeaponIndex].name)
			text.innerText = `You have bought ${weapons[currentWeaponIndex].name}.`

			text.innerText += ` Your inventory: ${inventory}`
		} else {
			text.innerText = "You haven't got enough gold to buy it"
		}
	} else {
		text.innerText = 'Currently you have the most powerful weapon'
		button2.innerText = 'Sell weapon for 15 gold'
		button2.onclick = sellWeapon
	}
}

function sellWeapon() {
	if (inventory.length > 1) {
		gold += 15
		goldText.innerText = gold
		let soldWeapon = inventory.shift()
		text.innerText = `You sold a ${soldWeapon}.`
		text.innerText += ` Now your inventory: ${inventory}`
	} else {
		text.innerText = 'You cannot sell your only weapon dude'
	}
}

//Cave functions
function goCave() {
	update(locations[2])
}

//fighting functions

function goFight() {
	update(locations[3])
	monsterHealth = monsters[fighting].health
	monsterHealthText.innerText = monsterHealth
	monsterName.innerText = monsters[fighting].name
	monsterStats.style.display = 'block'
}

function fightSlime() {
	fighting = 0
	goFight()
}

function fightBeast() {
	fighting = 1
	goFight()
}

function fightDragon() {
	fighting = 2
	goFight()
}

function attack() {
	text.innerText = `The ${monsters[fighting].name} attacks.`
	text.innerText += ` You attack with your ${weapons[currentWeaponIndex].name}.`
	health -= getMonsterAttackValue(monsters[fighting].level)
	if (Math.random() >= 0.2 || health < 20) {
		monsterHealth -=
			weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1
	} else {
		text.innerText += ' You miss.'
	}
	healthText.innerText = health
	monsterHealthText.innerText = monsterHealth

	if (monsterHealth <= 0) {
		fighting === 2 ? winGame() : defeatMonster()
	}

	if (health <= 0) {
		loseGame()
	}

	if (Math.random() <= 0.1 && inventory.length > 1) {
		const brokenWeapon = inventory.pop()
		text.innerText += ` Your ${brokenWeapon} has been broken.`
	}
}

function getMonsterAttackValue(level) {
	const hit = level * 5 - Math.floor(Math.random() * xp)
	return hit > 0 ? hit : 0
}

function dodge() {
	text.innerText = `You dodged an attack from ${monsters[fighting].name}`
}

//others functions

function winGame() {
	update(locations[5])
}

function defeatMonster() {
	gold += Math.floor(monsters[fighting].level * 6.7)
	xp += monsters[fighting].level
	goldText.innerText = gold
	xpText.innerText = xp
	fighting = null
	update(locations[4])
}

function loseGame() {
	update(locations[6])
}

function restart() {
	gold = 50
	xp = 0
	health = 100
	currentWeaponIndex = 0
	goldText.innerText = gold
	xpText.innerText = xp
	healthText.innerText = health
	inventory = ['stick']
	goTown()
}

function easterEgg() {
	update(locations[7])
}

function pick(guess) {
	const numbers = []
	while (numbers.length < 10) {
		numbers.push(Math.floor(Math.random() * 11))
	}
	locations[8].text = `You picked ${guess}. Here are the numbers: \n`
	for (let i = 0; i < 10; i++) {
		locations[8].text += numbers[i] + '\n'
	}
	if (numbers.includes(guess)) {
		locations[8].text += '. Right! You win 20 gold.'
		gold += 20
		goldText.innerText = gold
	} else {
		locations[8].text += '. Wrong! You lose 10 health.'
		health -= 10
		healthText.innerText = health
		if (health <= 0) {
			loseGame()
		}
	}
	update(locations[8])
}

function pickTwo() {
	pick(2)
}

function pickEight() {
	pick(8)
}
