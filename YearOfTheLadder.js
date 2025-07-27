// const MATERIAL_PROFILES = {
//   blueprint: {

//   }
// }

//globals
let gridArray = [-4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5]
let groupOfTiles = []
let groupOfTilesRight = []
let wallCols
let wallRows

//snakes ladders
let snakes = []
let ladders = []
let playerPos = 0
let targetPos = 0
let diceRoll
let moving = false
let moveSpeed = 0.05 // Speed of smooth movement
let moveProgress = 0
let moveDelay = 40 // Pause duration after reaching final position
let delayCounter = 0
let gameOver = false
let movementQueue = [] // Stores steps for sequential movement
let cycleCount = 0 // Track how many full cycles (0-12)
let totalCycles = 12 // Limit to 12 game loops

//gameOvre
let gameOvreDimA = []
let gameOvreDimB = []
let gameOvrePath = []
let gameOvreMovers = []
let numChainRects = 64
let gameOvreSpeed = 0.2

//new board
let boardGrids = []

//pieces
let gamePiecesTiles = [] // array to store all tile sets
let numPieces = 12 // no. of pieces
let gamePiecesMinis = []

//regenerate click
let isRegenerating = false // tracks whether regeneration is ongoing
let regenerationCount = 0 // counts the number of regenerations
let maxRegenerations // total regenerations
let regenerationInterval // Interval between regenerations in milliseconds
let baseInterval = 10 // Minimum interval for regeneration
let maxInterval = 500 // Maximum interval towards the end
let raritySelect

function setup() {
  //randomSeed(10)
  rectMode(CENTER)
  imageMode(CENTER)
  angleMode(RADIANS)
  textAlign(CENTER, CENTER)
  colorMode(HSB, 360, 100, 100, 255)
  textFont('sans-serif')
  //createCanvas(976, 1642)
  createCanvas(659,1100)
  //createCanvas(497,830)
  //createCanvas(windowWidth, windowHeight)

  maxRegenerations = random(10, 20) //not fixed random

  //fixing random at mint
  if (typeof blockHash !== 'undefined') {
    const seed = `${tokenId}${blockHash.slice(0, 10)}`
    randomSeed(seed)
  }
  //testing with fixed random seed
  //randomSeed(20)

  regenerationInterval = 1 //20

  numberInsets = random(0, 0.45)

  //createCanvas(1200, 1800)
  // createCanvas(950,1600)
  //createCanvas(1830,1030)
  raritySelect = random(1)
  colorShiftScale = random(1)

  //noLoop()

  if (raritySelect >= 0 && raritySelect < 0.35) {
    backgroundMaterial = 'paper'
  }
  if (raritySelect >= 0.35 && raritySelect < 0.75) {
    backgroundMaterial = 'blueprint'
  }
  if (raritySelect >= 0.75 && raritySelect < 0.85) {
    backgroundMaterial = 'screen'
  }
  if (raritySelect >= 0.85 && raritySelect < 0.9) {
    backgroundMaterial = 'two-bit color'
  }
  if (raritySelect >= 0.9 && raritySelect < 0.95) {
    backgroundMaterial = 'two-bit B+W'
  }
  if (raritySelect >= 0.95 && raritySelect < 1) {
    backgroundMaterial = 'back of the cloth'
  }

  //generate tiles setup
  //generate tiles
  tileMinis = Math.floor(random(3, 6))
  tileMinisRight = Math.floor(random(3, 6))
  tileDecaySpectrum = random(0.49, 3)
  tileDecaySpectrumRight = random(0.49, 3)
  tileDesignProportionA = random(0, 0.7)
  tileDesignProportionB = random(0, 0.2)
  tileSizeInsetLeft = random(0.5, 0.8)
  tileSizeInsetRight = random(0.5, 0.8)

  //generate units and tiles
  generateTiles()
  generateUnits()
  updateGameOvrePath()

  colorVariableH = []
  colorVariableS = []
  colorVariableB = []

  ////COLORS
  monoColor = Math.floor(random(0, 360))
  if (backgroundMaterial == 'blueprint') {
    backgroundColor = [18, 3, 15, 255]
    tileBackColor = [18, 3, 15, 255]
    tileGroutColor = [220, 3, 14, 255]
    backgroundBoxColor = [18, 3, 10, 255] //minus 5 for brightness
    //backgroundBoxColor = [18, 3, 90, 255]
    lineColor = [0, 12, 40, 255]
    basementColor = [18, 3, 0, 255]
    piecesColor = [18, 3, 10, 255]
    heavenColor = 20
    basementPieceColor = 50
    writingColor = [18, 3, 85, 255]
    gamePieceBottom = [18, 3, 85, 255]
    gamePieceTop = [18, 3, 85, 255]
    tileAlpha = 55
    for (let j = 0; j < 50; j++) {
      let randomColorVariableS = random(0, 100)
      let randomColorVariableB = random(0, 100)
      colorVariableS.push(randomColorVariableS)
      colorVariableB.push(randomColorVariableB)
    }
  } else if (backgroundMaterial == 'paper') {
    // backgroundMaterial = 'paper'
    backgroundColor = [18, 3, 85, 255]
    tileBackColor = [18, 3, 85, 255]
    tileGroutColor = [220, 3, 82, 255]
    backgroundBoxColor = [18, 3, 90, 255] //plus 5 for brightness
    lineColor = [220, 50, 80, 255]
    basementColor = [18, 3, 10, 255]
    piecesColor = [18, 3, 90, 255]
    heavenColor = 2
    basementPieceColor = 0
    writingColor = [18, 3, 85, 255]
    gamePieceBottom = [18, 3, 85, 255]
    gamePieceTop = [18, 3, 15, 255]
    tileAlpha = 55
    for (let j = 0; j < 50; j++) {
      let randomColorVariableS = random(0, 100)
      let randomColorVariableB = random(0, 100)
      colorVariableS.push(randomColorVariableS)
      colorVariableB.push(randomColorVariableB)
    }
  } else if (backgroundMaterial == 'screen') {
    backgroundColor = [18, 3, 0, 255]
    tileBackColor = [18, 3, 0, 255]
    tileGroutColor = [220, 3, 0, 255]
    backgroundBoxColor = [18, 3, 0, 255] //minus 5 for brightness
    //backgroundBoxColor = [18, 3, 90, 255]
    lineColor = [0, 12, 0, 255]
    basementColor = [18, 3, 0, 255]
    piecesColor = [18, 3, 0, 255]
    heavenColor = 20
    basementPieceColor = 50
    writingColor = [18, 3, 100, 255]
    gamePieceBottom = [18, 3, 100, 255]
    gamePieceTop = [18, 3, 100, 255]
    tileAlpha = 55

    for (let j = 0; j < 50; j++) {
      let randomColorVariableS = random() < 6 / 7 ? 100 : 0 // 2/3 chance of 100, 1/3 chance of 0
      let randomColorVariableB = random() < 2 / 3 ? 100 : 0

      colorVariableS.push(randomColorVariableS)
      colorVariableB.push(randomColorVariableB)
    }
  } else if (backgroundMaterial == 'two-bit color') {
    backgroundColor = [18, 3, 0, 255]
    tileBackColor = [18, 3, 0, 255]
    tileGroutColor = [220, 3, 0, 255]
    backgroundBoxColor = [18, 3, 0, 255] //minus 5 for brightness
    //backgroundBoxColor = [18, 3, 90, 255]
    lineColor = [0, 12, 0, 255]
    basementColor = [monoColor, 100, 100, 255]
    piecesColor = [18, 3, 0, 255]
    heavenColor = 20
    basementPieceColor = 50
    writingColor = [18, 3, 0, 255]
    gamePieceBottom = [0, 100, 0, 255]
    gamePieceTop = [monoColor, 100, 100, 255]
    tileAlpha = 0

    for (let j = 0; j < 50; j++) {
      let randomColorVariableS = 100
      let randomColorVariableB = random() < 2 / 3 ? 100 : 0

      colorVariableS.push(randomColorVariableS)
      colorVariableB.push(randomColorVariableB)
    }
  } else if (backgroundMaterial == 'two-bit B+W') {
    backgroundColor = [18, 3, 0, 255]
    tileBackColor = [18, 3, 0, 255]
    tileGroutColor = [18, 3, 0, 255]
    backgroundBoxColor = [18, 3, 0, 255] //minus 5 for brightness
    //backgroundBoxColor = [18, 3, 90, 255]
    lineColor = [220, 0, 10, 255]
    basementColor = [monoColor, 0, 100, 255]
    piecesColor = [18, 3, 0, 255]
    heavenColor = 20
    basementPieceColor = 50
    writingColor = [18, 0, 0, 255]
    gamePieceBottom = [18, 3, 0, 255]
    gamePieceTop = [monoColor, 0, 100, 255]
    tileAlpha = 0

    for (let j = 0; j < 50; j++) {
      let randomColorVariableS = 3
      let randomColorVariableB = random() < 1 / 3 ? 100 : 0

      colorVariableS.push(randomColorVariableS)
      colorVariableB.push(randomColorVariableB)
    }
  } else if (backgroundMaterial == 'back of the cloth') {
    backgroundColor = [25, 10, 88, 255]
    tileBackColor = [25, 10, 88, 255]
    tileGroutColor = [25, 10, 88, 255]
    backgroundBoxColor = [18, 3, 20, 255] //minus 5 for brightness
    //backgroundBoxColor = [18, 3, 90, 255]
    lineColor = [220, 3, 12, 255]
    basementColor = [18, 3, 0, 255]
    piecesColor = [18, 3, 0, 255]
    heavenColor = 20
    basementPieceColor = 50
    writingColor = [36, 2, 94, 255]
    gamePieceBottom = [220, 100, 90, 255]
    gamePieceTop = [220, 100, 90, 255]
    gamePieceMario = [0, 100, 100, 255]
    gamePieceMarioSkin = [17, 32, 96, 255]
    donkeyKongLadder = [24, 80, 100, 255]
    donkeyKongSnake = [175, 70, 100, 255] //[24, 97, 91, 255]
    donkeyKongStructure = [336, 81, 94, 255]
    tileAlpha = 55

    for (let j = 0; j < 50; j++) {
      //let randomColorVariableS = random() < 6 / 7 ? 100 : 0 // 2/3 chance of 100, 1/3 chance of 0
      let randomColorVariableS = random(3, 3) //for black and white
      let randomColorVariableB = random() < 1 / 3 ? 20 : 95
      //let randomColorVariableB = random(0,90)

      colorVariableS.push(randomColorVariableS)
      colorVariableB.push(randomColorVariableB)
    }
  }

  if (backgroundMaterial == 'back of the cloth') {
    traitColorValue = '~~zero~~~'
    startColorH = 18
    HueSeed = 'DONKEY KONG'
    colorShiftValue1 = 10 // 70% range
    colorShiftValue2 = 10 // 30% range
    for (let j = 0; j < 50; j++) {
      let randomColorVariableH = startColorH
      colorVariableH.push(randomColorVariableH)
    }
  } else if (backgroundMaterial == 'two-bit B+W') {
    traitColorValue = '~zero~'
    startColorH = 18
    HueSeed = 'ink'
    for (let j = 0; j < 50; j++) {
      let randomColorVariableH = startColorH
      colorVariableH.push(randomColorVariableH)
    }
  } else if (backgroundMaterial == 'two-bit color') {
    traitColorValue = '~zero~'
    startColorH = monoColor
    HueSeed = startColorH
    for (let j = 0; j < 50; j++) {
      let randomColorVariableH = startColorH
      colorVariableH.push(randomColorVariableH)
    }
  } else {
    startColorH = Math.floor(random(0, 360))
    HueSeed = startColorH
    //hue shift
    //colorShiftValue = random(180)
    if (colorShiftScale > 0.5) {
      traitColorValue = 'higher'
      colorShiftValue1 = random(0, 240) // 80% range
      colorShiftValue2 = random(120, 240) // 20% range
    }
    if (colorShiftScale <= 0.5) {
      traitColorValue = 'lower'
      colorShiftValue1 = random(0, 10) // 80% range
      colorShiftValue2 = random(0, 240) // 20% range
    }

    for (let j = 0; j < 50; j++) {
      let shiftValue
      // 80% chance to use the smaller shift, 20% to use the larger shift
      if (random() < 0.8) {
        shiftValue = random(-colorShiftValue1, colorShiftValue1)
      } else {
        shiftValue = random(-colorShiftValue2, colorShiftValue2)
      }
      let randomColorVariableH = (startColorH + shiftValue) % 360

      if (randomColorVariableH < 0) {
        randomColorVariableH += 360
      }
      colorVariableH.push(randomColorVariableH)
    }
  }

  background(backgroundColor)

  // Generate 60 unique instances
  for (let i = 0; i < 60; i++) {
    let grid = new boardGrid(0, 0)
    boardGrids.push(grid)
  }

  tileColorOffset = floor(random(0, colorVariableH.length))

  //generate pieces
  // Generate 12 unique tile grids
  for (let i = 0; i < numPieces; i++) {
    let piecesMinis = Math.floor(random(3, 6))
    let piecesDecay = random(0.49, 3)
    let pieces = []

    // Create the overlay grid for this piece
    for (let j = 0; j < piecesMinis * piecesMinis; j++) {
      let piecesOnOff = random(piecesDecay)
      pieces.push(piecesOnOff > 0.5) // Push true (on) or false (off)
    }
    gamePiecesTiles.push(pieces)
    gamePiecesMinis.push(piecesMinis)
  }

  //the below is a fix for snake heads / ladder bottoms not doubling up
  let numSnakes = floor(random(3, 8))
  let usedPositions = new Set() // Track occupied positions

  // Generate Snakes
  for (let i = 0; i < numSnakes; i++) {
    let head, tail

    // Ensure the snake head is unique
    do {
      head = floor(random(8, 47)) // Head must be at least 8 to avoid looping errors
    } while (usedPositions.has(head))

    usedPositions.add(head) // mark position as used

    // generate snake tail below the head
    tail = floor(random(0, head - 6))
    snakes.push({ head, tail })
  }

  let numLadders = floor(random(3, 8))

  // generate the laddders
  for (let i = 0; i < numLadders; i++) {
    let bottom, top

    // Ensure the ladder bottom is unique
    do {
      bottom = floor(random(1, 42)) // Bottom must be within the grid range
    } while (usedPositions.has(bottom))

    usedPositions.add(bottom) // Mark this position as used

    // Generate a valid top above the bottom
    top = floor(random(bottom + 6, 46))

    ladders.push({ bottom, top })
  }

  //gameovre
  for (let i = 0; i < 22; i++) {
    let dimA = random(0.1, 0.8) //not hl.
    let dimB = random(0.1, 0.9) //not hl.
    gameOvreDimA.push(dimA)
    gameOvreDimB.push(dimB)
  }

  if (backgroundMaterial == 'back of the cloth') {
    ornamentTrait = 'CAD'
  } else ornamentTrait = Math.floor(numberInsets * 10) + 1

  // Set traits ///the names can't be variables!!
  let traits = {
    'Drawing material': backgroundMaterial,
    'Palette variation': traitColorValue,
    'Hue seed': HueSeed,
    'Ornament level': ornamentTrait,
    'Snake count': numSnakes,
    'Ladder count': numLadders,
  }
  //set traits
  // hl.token.setTraits(traits)
  // hl.token.setName(`Year of the Ladder #${hl.tx.tokenId}`)
}

function generateTiles() {
  groupOfTiles = []
  groupOfTilesRight = []

  numberOfTiles = ((width / (height / 2 / 10)) * height) / 20
  // Create unique grids
  for (let i = 0; i < numberOfTiles; i++) {
    let tiles = [] // Create a new array for each grid
    let tilesRight = [] // Create a new array for each grid

    // Create a grid
    for (let j = 0; j < tileMinis * tileMinis; j++) {
      let tileOnOff = random(tileDecaySpectrum) // Generate a random number on a new, decayed, very decayed spectrum, //not hl.
      tiles.push(tileOnOff > 0.5) // Push true (on) if > 0.5, false (off) otherwise
    }
    for (let k = 0; k < tileMinisRight * tileMinisRight; k++) {
      let tileOnOffR = random(tileDecaySpectrumRight) // Generate a random number on a new, decayed, very decayed spectrum, //not hl.
      tilesRight.push(tileOnOffR > 0.5) // Push true (on) if > 0.5, false (off) otherwise
    }

    // Add the completed grid to the group of tiles
    groupOfTiles.push(tiles)
    groupOfTilesRight.push(tilesRight)
  }

  borderEdgeSizeLeft = 0.5
  borderEdgeSizeRight = 1

  tilePattern = tilePattern02
  tilePatternHeader = tilePattern02
  tilePatternName = 'type 02'
}

function generateUnits() {
  //units setup
  unit = height / 6
  mainCanvasHeight = unit * 6
  mainCanvasWidth = unit * 3
  mainCanvasX = width / 2
  canvasY = height / 2
  sideCanvasWidth = (width - mainCanvasWidth) / 2
  leftCanvasX = width / 2 - mainCanvasWidth / 2 - sideCanvasWidth / 2
  rightCanvasX = width / 2 + mainCanvasWidth / 2 + sideCanvasWidth / 2

  gridWidth = height / 2 / 10
  crossUnit = unit * 0.9
  gapFillWidth =
    sideCanvasWidth - Math.floor(sideCanvasWidth / gridWidth) * gridWidth
  tileSize = gridWidth / tileMinis
  tileSizeRight = gridWidth / tileMinisRight
  tileEachPieceSize = gridWidth / tileMinis
  wallSize = crossUnit
}

function updateGameOvrePath() {
  gameOvrePath = []
  //gameOvre path
  //gameOvrePieceSize = unit * 0.1
  gameOvrePieceSize = (unit / numChainRects) * 6
  gameOvreBaseX = width / 2 - gridWidth * 4.5
  gameOvreBaseY = height - gridWidth * 2.5 - crossUnit * 1
  gameOvreBaseW = mainCanvasWidth - gridWidth
  gameOvreBaseH = crossUnit
  gameOvrePieceInset = gameOvrePieceSize * 0.5

  //defining path
  for (
    let x = gameOvreBaseX + gameOvrePieceSize * 1;
    x <=
    gameOvreBaseX + gameOvreBaseW - gameOvrePieceSize / 2 - gameOvrePieceInset;
    x += gameOvrePieceSize
  ) {
    gameOvrePath.push({
      pos: createVector(
        x,
        gameOvreBaseY + gameOvreBaseH - gameOvrePieceSize / 2
      ),
      angle: 0,
    }) // Bottom edge (L→R)
  }
  for (
    let y =
      gameOvreBaseY +
      gameOvreBaseH -
      gameOvrePieceSize / 2 -
      gameOvrePieceInset;
    y >= gameOvreBaseY + gameOvrePieceSize / 2 + gameOvrePieceInset;
    y -= gameOvrePieceSize
  ) {
    gameOvrePath.push({
      pos: createVector(
        gameOvreBaseX +
          gameOvreBaseW -
          gameOvrePieceSize / 2 -
          gameOvrePieceInset,
        y
      ),
      angle: HALF_PI,
    }) // Right edge (B→T)
  }
  for (
    let x =
      gameOvreBaseX +
      gameOvreBaseW -
      gameOvrePieceSize / 2 -
      gameOvrePieceInset;
    x >= gameOvreBaseX + gameOvrePieceSize / 2 + gameOvrePieceInset;
    x -= gameOvrePieceSize
  ) {
    gameOvrePath.push({
      pos: createVector(
        x,
        gameOvreBaseY + gameOvrePieceSize / 2 + gameOvrePieceInset
      ),
      angle: PI,
    }) // Top edge (R→L)
  }
  for (
    let y = gameOvreBaseY + gameOvrePieceSize / 2 + gameOvrePieceInset;
    y <=
    gameOvreBaseY + gameOvreBaseH - gameOvrePieceSize / 2 - gameOvrePieceInset;
    y += gameOvrePieceSize
  ) {
    gameOvrePath.push({
      pos: createVector(
        gameOvreBaseX + gameOvrePieceSize / 2 + gameOvrePieceInset,
        y
      ),
      angle: -HALF_PI,
    }) // Left edge (T→B)
  }

  // Initialize movers along the path
  gameOvreMovers = []
  //let spacing = Math.floor(gameOvrePath.length / numChainRects)
  let spacing = Math.round(gameOvrePath.length / numChainRects)
  for (let i = 0; i < numChainRects; i++) {
    gameOvreMovers.push({ index: i * spacing, progress: 0 }) // Track fractional movement
  }
}

function draw() {
  generateUnits()
  background(backgroundColor)
  fill(backgroundBoxColor)
  //fill(0,100,100,255)
  noStroke()
  //stroke(lineColor)
  rect(
    mainCanvasX,
    canvasY - gridWidth * 0.5,
    mainCanvasWidth - gridWidth * 0.5,
    mainCanvasHeight - gridWidth * 3.5
  )

  ////////TILES /////////////////////////
  ////////TILES /////////////////////////
  ////////TILES /////////////////////////
  ////////TILES /////////////////////////
  ////////TILES /////////////////////////

  //top and bottom grid bars - central fixed
  fill(backgroundColor)
  noStroke()
  rect(width / 2, height - gridWidth, gridWidth * 10 + 1, gridWidth * 2)
  rect(width / 2, gridWidth * 0.5, gridWidth * 10 + 1, gridWidth)
  noFill()
  //stroke(0, 100, 100)

  for (let i = 0; i < 30; i++) {
    fill(colorVariableH[i], colorVariableS[i], colorVariableB[i], 155)
    noStroke()
    rect(
      width / 2 - gridWidth * gridArray[i],
      gridWidth / 2,
      gridWidth,
      gridWidth
    )
    fill(colorVariableH[i], colorVariableS[i], colorVariableB[i], 255)
    tilePatternHeader(
      width / 2 - gridWidth * gridArray[i],
      gridWidth / 2,
      gridWidth,
      gridWidth
    )
    fill(
      colorVariableH[i + 10],
      colorVariableS[i + 10],
      colorVariableB[i + 10],
      155
    )
    rect(
      width / 2 - gridWidth * gridArray[i],
      height - gridWidth / 2,
      gridWidth,
      gridWidth
    )
    fill(
      colorVariableH[i + 10],
      colorVariableS[i + 10],
      colorVariableB[i + 10],
      255
    )
    tilePatternHeader(
      width / 2 - gridWidth * gridArray[i],
      height - gridWidth / 2,
      gridWidth,
      gridWidth
    )
    fill(
      colorVariableH[i + 20],
      colorVariableS[i + 20],
      colorVariableB[i + 20],
      155
    )
    rect(
      width / 2 - gridWidth * gridArray[i],
      height - gridWidth * 1.5,
      gridWidth,
      gridWidth
    )
    fill(
      colorVariableH[i + 20],
      colorVariableS[i + 20],
      colorVariableB[i + 20],
      255
    )
    tilePatternHeader(
      width / 2 - gridWidth * gridArray[i],
      height - gridWidth * 1.5,
      gridWidth,
      gridWidth
    )
  }

  //side grid bars - horizontal rows - decayed tile panels
  //stroke(0, 100, 100, 255)
  for (let j = 0; j < 20; j++) {
    for (let i = 0; i < Math.floor(sideCanvasWidth / gridWidth); i++) {
      let tileColorIndex = (tileColorOffset + i + j * 3) % colorVariableH.length
      // Draw the tiles for all rows
      fill(
        colorVariableH[tileColorIndex],
        colorVariableS[tileColorIndex],
        colorVariableB[tileColorIndex],
        255
      )
      tilePattern(
        gridWidth / 2 + gridWidth * i,
        gridWidth * 0.5 + gridWidth * j,
        gridWidth * tileSizeInsetLeft,
        gridWidth * tileSizeInsetLeft
      )
      fill(
        colorVariableH[tileColorIndex],
        colorVariableS[tileColorIndex],
        colorVariableB[tileColorIndex],
        255
      )
      tilePattern(
        width - gridWidth / 2 - gridWidth * i,
        gridWidth * 0.5 + gridWidth * j,
        gridWidth * tileSizeInsetRight,
        gridWidth * tileSizeInsetRight
      )

      noStroke()

      //tile decay overlays
      //left side
      let gridDecay =
        groupOfTiles[j * Math.floor(sideCanvasWidth / gridWidth) + i] //there are 200 outcomes
      for (let t = 0; t < gridDecay.length; t++) {
        let x =
          tileSize / 2 + gridWidth * i + Math.floor(t / tileMinis) * tileSize
        let y =
          0 + tileSize * 0.5 + (t % tileMinis) * 1 * tileSize + gridWidth * j
        if (gridDecay[t]) {
          fill(tileBackColor) // Tile is on (black)
          //fill(220,0,100,255)
          stroke(tileGroutColor)
          strokeWeight(unit / 100)
        } else {
          noFill() // Tile is off (nothing)
          noStroke()
        }
        rect(x, y, tileSize * 1.1, tileSize * 1.1) //turn off decay
        noFill()
      }
      //right side
      fromRight = width - gridWidth + tileSizeRight / 2
      let gridDecay2 =
        groupOfTilesRight[j * Math.floor(sideCanvasWidth / gridWidth) + i] //add in +51 at end maybe. there are 200 outcomes
      for (let t = 0; t < gridDecay2.length; t++) {
        let x =
          fromRight -
          gridWidth * i +
          Math.floor(t / tileMinisRight) * tileSizeRight
        let y =
          0 +
          tileSizeRight * 0.5 +
          (t % tileMinisRight) * tileSizeRight +
          gridWidth * j
        if (gridDecay2[t]) {
          fill(tileBackColor) // tile is on (black)
          //fill(220,0,100,255)
          stroke(tileGroutColor)
          strokeWeight(unit / 100)
        } else {
          noFill() // tile is off (nothing)
          noStroke()
        }

        rect(x, y, tileSizeRight * 1.1, tileSizeRight * 1.1) //turn off decay
        noFill()
      }
    }
  }
  //gap-fill grids
  //left
  for (let j = 0; j < 20; j++) {
    fill(colorVariableH[j], colorVariableS[j], colorVariableB[j + 10], 255)
    tilePattern(
      sideCanvasWidth - gapFillWidth / 2,
      gridWidth / 2 + gridWidth * j,
      gapFillWidth * 0.8,
      gapFillWidth * 0.8
    )
  }

  //right
  for (let j = 0; j < 20; j++) {
    fill(colorVariableH[j], colorVariableS[j + 10], colorVariableB[j], 255)
    tilePattern(
      sideCanvasWidth + mainCanvasWidth + gapFillWidth / 2,
      gridWidth / 2 + gridWidth * j,
      gapFillWidth * 0.8,
      gapFillWidth * 0.8
    )
  }

  //side grid bars - fixed vertical
  if (sideCanvasWidth >= gridWidth) {
    //right
    for (let i = 0; i < 20; i++) {
      noStroke()
      fill(backgroundColor)
      rect(width - gridWidth / 2, gridWidth / 2 + gridWidth * i, gridWidth)
      fill(
        colorVariableH[i + 4],
        colorVariableS[i + 10],
        colorVariableB[i],
        155
      )
      rect(width - gridWidth / 2, gridWidth / 2 + gridWidth * i, gridWidth)
      fill(
        colorVariableH[i + 4],
        colorVariableS[i + 10],
        colorVariableB[i],
        255
      )
      tilePatternHeader(
        width - gridWidth / 2,
        gridWidth / 2 + gridWidth * i,
        gridWidth * borderEdgeSizeRight,
        gridWidth * borderEdgeSizeRight
      )
    }
    //left
    for (let i = 0; i < 20; i++) {
      noStroke()
      fill(backgroundColor)
      rect(gridWidth / 2, gridWidth / 2 + gridWidth * i, gridWidth)
      fill(colorVariableH[i], colorVariableS[i + 3], colorVariableB[i + 4], 255)
      rect(gridWidth / 2, gridWidth / 2 + gridWidth * i, gridWidth, gridWidth)
      fill(colorVariableH[i], colorVariableS[i + 3], colorVariableB[i + 4], 255)
      tilePatternHeader(
        gridWidth / 2,
        gridWidth / 2 + gridWidth * i,
        gridWidth * borderEdgeSizeLeft,
        gridWidth * borderEdgeSizeLeft
      )
    }
  } else if (sideCanvasWidth < gridWidth) {
    //when the format is ~9:16
    //right
    for (let i = 0; i < 20; i++) {
      noStroke()
      fill(backgroundColor)
      rect(
        sideCanvasWidth + mainCanvasWidth + gapFillWidth / 2,
        gridWidth / 2 + gridWidth * i,
        gapFillWidth,
        gridWidth
      )
      fill(
        colorVariableH[i + 4],
        colorVariableS[i + 10],
        colorVariableB[i],
        155
      )
      rect(
        sideCanvasWidth + mainCanvasWidth + gapFillWidth / 2,
        gridWidth / 2 + gridWidth * i,
        gapFillWidth,
        gridWidth
      )
      fill(
        colorVariableH[i + 4],
        colorVariableS[i + 10],
        colorVariableB[i],
        255
      )

      tilePatternHeader(
        sideCanvasWidth + mainCanvasWidth + gapFillWidth / 2,
        gridWidth / 2 + gridWidth * i,
        gapFillWidth,
        gridWidth
      )
    }
    for (let i = 0; i < 20; i++) {
      noStroke()
      fill(backgroundColor)
      rect(
        sideCanvasWidth - gapFillWidth / 2,
        gridWidth / 2 + gridWidth * i,
        gapFillWidth,
        gridWidth
      )
      fill(colorVariableH[i], colorVariableS[i + 3], colorVariableB[i + 4], 155)
      rect(
        sideCanvasWidth - gapFillWidth / 2,
        gridWidth / 2 + gridWidth * i,
        gapFillWidth,
        gridWidth
      )
      fill(colorVariableH[i], colorVariableS[i + 3], colorVariableB[i + 4], 255)
      tilePatternHeader(
        sideCanvasWidth - gapFillWidth / 2,
        gridWidth / 2 + gridWidth * i,
        gapFillWidth,
        gridWidth
      )
    }
  }

  noStroke()

  let boardColumns = []
  let boardRows = []

  // Generate 6 column positions
  for (let i = 0; i < 6; i++) {
    boardColumns.push(mainCanvasX - crossUnit * 1 + i * crossUnit * 0.5)
  }

  // Generate 8 row positions
  for (let i = 0; i < 8; i++) {
    boardRows.push(gridWidth * 14 - i * crossUnit * 0.5)
  }

  //draw game board
  // Draw game board using loops
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      let index = row * 6 + col
      if (index < boardGrids.length) {
        push()
        translate(boardColumns[col], boardRows[row])
        if (backgroundMaterial == 'back of the cloth') {
          push()
          fill(basementColor)
          stroke(donkeyKongStructure)
          strokeWeight(unit * 0.003)
          rect(0 - crossUnit * 0.25, 0 - crossUnit * 0.25, crossUnit * 0.5)
          pop()
        } else {
          boardGrids[index].draw()
        }
        pop()
      }
    }
  }

  // Regenerate board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      let index = row * 6 + col
      if (index < boardGrids.length) {
        let realIndex = getRealIndex(playerPos)
        if (index === realIndex) {
          boardGrids[index].regenerate()
        }
      }
    }
  }

  // Mouse hover detection with a loop
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      let index = row * 6 + col
      if (index < boardGrids.length) {
        if (
          mouseX > boardColumns[col] - crossUnit * 0.5 &&
          mouseX < boardColumns[col] &&
          mouseY > boardRows[row] - crossUnit * 0.5 &&
          mouseY < boardRows[row]
        ) {
          boardGrids[index].regenerate()
        }
      }
    }
  }

  //bottom boards
  fill(colorVariableH[0], colorVariableS[0], colorVariableB[0], 255)
  rect(
    width / 2,
    height - gridWidth * 2.5 - crossUnit * 0.5,
    mainCanvasWidth - gridWidth,
    crossUnit
  )

  //game pieces
  noStroke()

  let pieceColumnA = width / 2 - crossUnit * 1.25
  let pieceColumnB = width / 2 - crossUnit * 0.75
  let pieceColumnC = width / 2 - crossUnit * 0.25
  let pieceColumnD = width / 2 + crossUnit * 0.25
  let pieceColumnE = width / 2 + crossUnit * 0.75
  let pieceColumnF = width / 2 + crossUnit * 1.25
  let pieceRow01 = height - gridWidth * 2.5 - crossUnit * 0.75
  let pieceRow02 = height - gridWidth * 1 - crossUnit * 0.75
  let heavenRow = gridWidth * 1.6
  let heavenColA = width / 2 - crossUnit * 1.25 - gridWidth / 2
  let heavenColB = heavenColA + crossUnit * 0.25
  let heavenColC = heavenColB + crossUnit * 0.25
  let heavenColD = heavenColC + crossUnit * 0.25
  let heavenColE = heavenColD + crossUnit * 0.25
  let heavenColF = heavenColE + crossUnit * 0.25
  let heavenColG = heavenColF + crossUnit * 0.25
  let heavenColH = heavenColG + crossUnit * 0.25
  let heavenColI = heavenColH + crossUnit * 0.25
  let heavenColJ = heavenColI + crossUnit * 0.25
  let heavenColK = heavenColJ + crossUnit * 0.25
  let heavenColL = heavenColK + crossUnit * 0.25

  fill(basementColor)
  rect(
    width / 2,
    height - gridWidth * 2.5 - crossUnit * 0.5,
    mainCanvasWidth - gridWidth,
    crossUnit
  )

  let basementIndices = []
  for (let i = cycleCount; i < min(cycleCount + 12, numPieces); i++) {
    basementIndices.push(i)
  }

  //shifting the pieces
  noStroke()

  if (!moving) {
    if (cycleCount >= totalCycles) {
      playerPos = -crossUnit * 4
      gameOver = true
    } else if (delayCounter > 0) {
      delayCounter--
    } else {
      rollDice()

      if (playerPos + diceRoll >= 53) {
        cycleCount++
        playerPos = cycleCount >= totalCycles ? -crossUnit : 0
        //something happens on screen at end of all game cycles
      } else {
        targetPos = min(playerPos + diceRoll, 47)
        prepareMovementQueue()
        moving = true
      }
    }
  } else {
    smoothMovePlayer()
  }

  function drawCycleProgress() {
    const pieceColumns = [
      pieceColumnA,
      pieceColumnB,
      pieceColumnC,
      pieceColumnD,
      pieceColumnE,
      pieceColumnF,
    ]

    const heavenCols = [
      heavenColL,
      heavenColK,
      heavenColJ,
      heavenColI,
      heavenColH,
      heavenColG,
      heavenColF,
      heavenColE,
      heavenColD,
      heavenColC,
      heavenColB,
      heavenColA,
    ]

    const basementIndices = []
    for (
      let i = cycleCount + 1;
      i < Math.min(cycleCount + 12, numPieces);
      i++
    ) {
      basementIndices.push(i)
    }

    // --- Draw Basement Area ---
    fill(basementColor)
    rect(
      width / 2,
      height - gridWidth * 2.5 - crossUnit * 0.5,
      mainCanvasWidth - gridWidth,
      crossUnit
    )

    for (let i = 0; i < basementIndices.length; i++) {
      const col = i % 6
      const row = i < 6 ? pieceRow01 : pieceRow02
      const pieceIndex = basementIndices[i]
      eachGamePiece(
        pieceColumns[col],
        row,
        gridWidth * 0.5,
        pieceIndex,
        pieceIndex,
        basementPieceColor
      )
    }

    // --- Draw Heaven Area (for ascended pieces) ---
    if (cycleCount > 0) {
      fill(backgroundBoxColor)
      rect(width / 2, heavenRow, mainCanvasWidth - gridWidth, gridWidth * 0.5)

      for (let i = 0; i < cycleCount && i < numPieces; i++) {
        eachGamePiece(
          heavenCols[i],
          heavenRow,
          gridWidth * 0.5,
          i,
          i,
          heavenColor
        )
      }
    }
  }

  if (cycleCount >= 0) {
    drawCycleProgress()
  }
  //capture preview
  // hl.token.capturePreview()

  if (cycleCount >= 1) {
    drawCycleProgress()
  }
  if (cycleCount >= 2) {
    drawCycleProgress()
  }
  if (cycleCount >= 3) {
    drawCycleProgress()
  }
  if (cycleCount >= 4) {
    drawCycleProgress()
  }
  if (cycleCount >= 5) {
    drawCycleProgress()
  }
  if (cycleCount >= 6) {
    drawCycleProgress()
  }
  if (cycleCount >= 7) {
    drawCycleProgress()
  }
  if (cycleCount >= 8) {
    drawCycleProgress()
  }
  if (cycleCount >= 9) {
    drawCycleProgress()
  }
  if (cycleCount >= 10) {
    drawCycleProgress()
  }
  if (cycleCount >= 11) {
    drawCycleProgress()
  }
  if (cycleCount >= 12) {
    drawCycleProgress()

    // //gameOvre
    //gameOvre
    fill(basementColor)
    rect(
      width / 2,
      height - gridWidth * 2.5 - crossUnit * 0.5,
      mainCanvasWidth - gridWidth,
      crossUnit
    )
    letterG(
      0,
      width / 2 - crossUnit * 1,
      height - gridWidth * 4,
      crossUnit * 0.05,
      crossUnit * 0.2
    )
    letterA(
      0,
      width / 2 - crossUnit * 0.75,
      height - gridWidth * 4,
      crossUnit * 0.05,
      crossUnit * 0.2
    )
    letterM(
      0,
      width / 2 - crossUnit * 0.45,
      height - gridWidth * 4,
      crossUnit * 0.05,
      crossUnit * 0.2
    )
    letterE(
      0,
      width / 2 - crossUnit * 0.15,
      height - gridWidth * 4,
      crossUnit * 0.05,
      crossUnit * 0.2
    )
    letterO(
      0,
      width / 2 + crossUnit * 0.25,
      height - gridWidth * 4,
      crossUnit * 0.05,
      crossUnit * 0.2
    )
    letterV(
      0,
      width / 2 + crossUnit * 0.5,
      height - gridWidth * 4,
      crossUnit * 0.05,
      crossUnit * 0.2
    )
    letterR(
      0,
      width / 2 + crossUnit * 0.75,
      height - gridWidth * 4,
      crossUnit * 0.05,
      crossUnit * 0.2
    )
    letterE(
      0,
      width / 2 + crossUnit * 1,
      height - gridWidth * 4,
      crossUnit * 0.05,
      crossUnit * 0.2
    )
    // move & draw snakes
    for (let i = 0; i < gameOvreMovers.length; i++) {
      let moverB = gameOvreMovers[i]

      // Calculate fractional step progress
      let nextIndex = (moverB.index + 1) % gameOvrePath.length
      let currPoint = gameOvrePath[moverB.index]
      let nextPoint = gameOvrePath[nextIndex]

      let interpolatedX = lerp(
        currPoint.pos.x,
        nextPoint.pos.x,
        moverB.progress
      )
      let interpolatedY = lerp(
        currPoint.pos.y,
        nextPoint.pos.y,
        moverB.progress
      )
      let angle = currPoint.angle

      // Assign colors based on index
      if (i < 1) {
        pieceIndexSelect = 0
      } else if (i < 10) {
        pieceIndexSelect = 1
      } else if (i < 20) {
        pieceIndexSelect = 2
      } else if (i < 25) {
        pieceIndexSelect = 3
      } else if (i < 35) {
        pieceIndexSelect = 4
      } else if (i < 45) {
        pieceIndexSelect = 5
      } else if (i < 55) {
        pieceIndexSelect = 6
      } else if (i < 62) {
        pieceIndexSelect = 7
      } else pieceIndexSelect = 0

      // Draw the moving square
      push()
      translate(interpolatedX, interpolatedY - gameOvrePieceSize * 0.2) // Centered position
      rotate(angle)
      fill(writingColor)
      gameOvrePiece(
        pieceIndexSelect,
        0,
        0,
        gameOvrePieceSize,
        gameOvrePieceSize
      )
      pop()

      // Update movement (fractional speed)
      moverB.progress += gameOvreSpeed
      if (moverB.progress >= 1) {
        moverB.progress = 0
        moverB.index = (moverB.index + 1) % gameOvrePath.length
      }
    }
  }

  if (backgroundMaterial == 'back of the cloth') {
    //border
    // stroke(0,0,90,255)
    // noFill()
    // rect(
    //   mainCanvasX,
    //   height / 2 - gridWidth * 0.5,
    //   mainCanvasWidth - gridWidth * 0.4,
    //   mainCanvasHeight - gridWidth * 3.4
    // )
    //titleblock and dice
    fill(backgroundBoxColor)
    //rect(width/2, height-gridWidth,gridWidth*10, gridWidth*2)

    fill(backgroundBoxColor)
    rect(width / 2, height - gridWidth, gridWidth * 10, gridWidth * 2)
    fill(backgroundColor)
    //fill(colorVariableH[0], colorVariableS[0], colorVariableB[0], 255)
    gameOvrePiece(
      0,
      width / 2,
      height - gridWidth,
      gridWidth * 2,
      gridWidth * 2
    )
    gameOvrePiece(
      1,
      width / 2 - gridWidth * 2,
      height - gridWidth,
      gridWidth * 2,
      gridWidth * 2
    )
    gameOvrePiece(
      2,
      width / 2 + gridWidth * 2,
      height - gridWidth,
      gridWidth * 2,
      gridWidth * 2
    )
    gameOvrePiece(
      3,
      width / 2 + gridWidth * 4,
      height - gridWidth,
      gridWidth * 2,
      gridWidth * 2
    )
    //noFill()
    // stroke(donkeyKongStructure)
    // rect(width/2, height-gridWidth*0.25,gridWidth*5.75, gridWidth*0.15)
    fill(backgroundBoxColor)
    rect(width / 2, height - gridWidth, gridWidth * 10, gridWidth * 2)
    fill(basementColor)
    rect(width / 2, height - gridWidth, gridWidth * 2, gridWidth * 2)
    //rect(width/2-gridWidth*4, height-gridWidth, gridWidth*2, gridWidth*2)
    //rect(width/2+gridWidth*4, height-gridWidth, gridWidth*2, gridWidth*2)
    displayDiceRoll(width / 2, height - gridWidth)

    //titleblock at top
    //fill(colorVariableH[0], colorVariableS[0], colorVariableB[0], 255)
    fill(backgroundBoxColor)
    rect(width / 2, gridWidth / 2, gridWidth * 10, gridWidth)
    fill(colorVariableH[0], colorVariableS[0], 9, 255)
    gameOvrePiece(
      4,
      width / 2 - gridWidth * 4.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )
    gameOvrePiece(
      5,
      width / 2 - gridWidth * 3.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )
    gameOvrePiece(
      6,
      width / 2 - gridWidth * 2.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )
    gameOvrePiece(
      7,
      width / 2 - gridWidth * 1.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )
    gameOvrePiece(
      8,
      width / 2 - gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )
    gameOvrePiece(
      9,
      width / 2 + gridWidth * 4.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )
    gameOvrePiece(
      10,
      width / 2 + gridWidth * 3.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )
    gameOvrePiece(
      11,
      width / 2 + gridWidth * 2.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )
    gameOvrePiece(
      12,
      width / 2 + gridWidth * 1.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )
    gameOvrePiece(
      13,
      width / 2 + gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5,
      gridWidth * 0.5
    )

    //vertical sides
    if (sideCanvasWidth >= gridWidth) {
      for (let i = 0; i < 20; i++) {
        fill(25, 5, 100, 255)
        gameOvrePiece(
          i,
          gridWidth * 0.5,
          gridWidth * 0.5 + gridWidth * i,
          gridWidth * 0.5,
          gridWidth * 0.5
        )
      }
      for (let i = 0; i < 20; i++) {
        fill(backgroundColor)
        gameOvrePiece(
          i,
          width - gridWidth * 0.5,
          height - gridWidth * 0.5 - gridWidth * i,
          gridWidth * 0.5,
          gridWidth * 0.5
        )
      }
    } else if (sideCanvasWidth < gridWidth) {
      for (let i = 0; i < 20; i++) {
        fill(25, 5, 100, 255)
        gameOvrePiece(
          i,
          gapFillWidth * 0.5,
          gridWidth * 0.5 + gridWidth * i,
          gapFillWidth,
          gridWidth * 0.5
        )
      }
      for (let i = 0; i < 20; i++) {
        fill(backgroundColor)
        gameOvrePiece(
          i,
          width - gapFillWidth * 0.5,
          height - gridWidth * 0.5 - gridWidth * i,
          gapFillWidth,
          gridWidth * 0.5
        )
      }
    }

    //drawing snakes and ladders
    //End Screen
    // fill(basementColor)
    // stroke(basementColor)
    // rect(
    //   mainCanvasX,
    //   canvasY - gridWidth * 0.5-crossUnit/2,
    //   mainCanvasWidth - gridWidth * 1,
    //   mainCanvasHeight - gridWidth * 5 - crossUnit
    // )
    //floors
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 7; j++) {
        fill(donkeyKongStructure)
        //fill(0,0,0,255)
        noStroke()
        //rect(mainCanvasX,gridWidth*2+gridWidth*i, 100, 20)
        gameOvrePiece(
          i,
          mainCanvasX -
            mainCanvasWidth * 0.5 +
            crossUnit * 0.175 +
            crossUnit * 0.5 * j,
          gridWidth * 2 + crossUnit * 0.5 * i,
          unit * 0.1,
          unit * 0.05
        )
      }
    }
    //floor levels
    stroke(donkeyKongStructure)
    //stroke(0,0,0,255)
    strokeWeight(unit / 150)
    noFill()
    rect(
      mainCanvasX + crossUnit * 0.25,
      gridWidth * 2,
      mainCanvasWidth - gridWidth * 2,
      unit * 0.05
    )
    rect(
      mainCanvasX - crossUnit * 0.25,
      gridWidth * 2 + crossUnit * 0.5,
      mainCanvasWidth - gridWidth * 2,
      unit * 0.05
    )
    rect(
      mainCanvasX + crossUnit * 0.25,
      gridWidth * 2 + crossUnit * 1,
      mainCanvasWidth - gridWidth * 2,
      unit * 0.05
    )
    rect(
      mainCanvasX - crossUnit * 0.25,
      gridWidth * 2 + crossUnit * 1.5,
      mainCanvasWidth - gridWidth * 2,
      unit * 0.05
    )
    rect(
      mainCanvasX + crossUnit * 0.25,
      gridWidth * 2 + crossUnit * 2,
      mainCanvasWidth - gridWidth * 2,
      unit * 0.05
    )
    rect(
      mainCanvasX - crossUnit * 0.25,
      gridWidth * 2 + crossUnit * 2.5,
      mainCanvasWidth - gridWidth * 2,
      unit * 0.05
    )
    rect(
      mainCanvasX + crossUnit * 0.25,
      gridWidth * 2 + crossUnit * 3,
      mainCanvasWidth - gridWidth * 2,
      unit * 0.05
    )
    rect(
      mainCanvasX - crossUnit * 0.25,
      gridWidth * 2 + crossUnit * 3.5,
      mainCanvasWidth - gridWidth * 2,
      unit * 0.05
    )
    rect(
      mainCanvasX + crossUnit * 0.25,
      gridWidth * 2 + crossUnit * 4,
      mainCanvasWidth - gridWidth * 2,
      unit * 0.05
    )
    strokeWeight(unit / 100)
    stairsLeft(mainCanvasX - crossUnit * 1.5, gridWidth * 2, crossUnit * 0.5)
    stairsLeft(
      mainCanvasX - crossUnit * 1.5,
      gridWidth * 2 + crossUnit * 1,
      crossUnit * 0.5
    )
    stairsLeft(
      mainCanvasX - crossUnit * 1.5,
      gridWidth * 2 + crossUnit * 2,
      crossUnit * 0.5
    )
    stairsLeft(
      mainCanvasX - crossUnit * 1.5,
      gridWidth * 2 + crossUnit * 3,
      crossUnit * 0.5
    )
    stairsRight(
      mainCanvasX + crossUnit * 1.5,
      gridWidth * 2 + crossUnit * 3.5,
      crossUnit * 0.5
    )
    stairsRight(
      mainCanvasX + crossUnit * 1.5,
      gridWidth * 2 + crossUnit * 2.5,
      crossUnit * 0.5
    )
    stairsRight(
      mainCanvasX + crossUnit * 1.5,
      gridWidth * 2 + crossUnit * 1.5,
      crossUnit * 0.5
    )
    stairsRight(
      mainCanvasX + crossUnit * 1.5,
      gridWidth * 2 + crossUnit * 0.5,
      crossUnit * 0.5
    )

    //snakes and ladders
    strokeWeight(10)
    stroke(backgroundBoxColor)
    drawSnakes(boardColumns, boardRows)
    drawLadders(boardColumns, boardRows)
    drawPlayer(boardColumns, boardRows)
  }
  // fill(0,100,100,255)
  // text(traitColorValue, width/4, height/2)
}

function stairsLeft(x, y, size) {
  //rect(x,y,size)
  push()
  translate(0, -size * 0.06)
  //verticals
  line(x, y + size, x, y + size * 0.8)
  line(x + size * 0.2, y + size * 0.8, x + size * 0.2, y + size * 0.6)
  line(x + size * 0.4, y + size * 0.6, x + size * 0.4, y + size * 0.4)
  line(x + size * 0.6, y + size * 0.4, x + size * 0.6, y + size * 0.2)
  line(x + size * 0.8, y + size * 0.2, x + size * 0.8, y)
  //horizontals
  line(x, y + size * 0.8, x + size * 0.2, y + size * 0.8)
  line(x + size * 0.2, y + size * 0.6, x + size * 0.4, y + size * 0.6)
  line(x + size * 0.4, y + size * 0.4, x + size * 0.6, y + size * 0.4)
  line(x + size * 0.6, y + size * 0.2, x + size * 0.8, y + size * 0.2)
  pop()
}
function stairsRight(x, y, size) {
  //rect(x,y,size)
  push()
  translate(0, -size * 0.06)
  //verticals
  line(x, y + size, x, y + size * 0.8)
  line(x - size * 0.2, y + size * 0.8, x - size * 0.2, y + size * 0.6)
  line(x - size * 0.4, y + size * 0.6, x - size * 0.4, y + size * 0.4)
  line(x - size * 0.6, y + size * 0.4, x - size * 0.6, y + size * 0.2)
  line(x - size * 0.8, y + size * 0.2, x - size * 0.8, y)
  //horizontals
  line(x, y + size * 0.8, x - size * 0.2, y + size * 0.8)
  line(x - size * 0.2, y + size * 0.6, x - size * 0.4, y + size * 0.6)
  line(x - size * 0.4, y + size * 0.4, x - size * 0.6, y + size * 0.4)
  line(x - size * 0.6, y + size * 0.2, x - size * 0.8, y + size * 0.2)
  pop()
}

function gameOvrePiece(index, x, y, sizeW, sizeH) {
  noStroke()

  let rectWidth = sizeW * gameOvreDimA[index]
  let rectHeight = sizeH * gameOvreDimB[index]

  rect(x, y, rectWidth, rectHeight)

  let remainingDimA = (sizeW - rectWidth) / 2
  let remainingDimB = (sizeH - rectHeight) / 2

  rect(
    x - sizeW / 2 + remainingDimA / 2,
    y - sizeH / 2 + remainingDimB / 2,
    remainingDimA,
    remainingDimB
  )
  rect(
    x + sizeW / 2 - remainingDimA / 2,
    y - sizeH / 2 + remainingDimB / 2,
    remainingDimA,
    remainingDimB
  )
  rect(
    x - sizeW / 2 + remainingDimA / 2,
    y + sizeH / 2 - remainingDimB / 2,
    remainingDimA,
    remainingDimB
  )
  rect(
    x + sizeW / 2 - remainingDimA / 2,
    y + sizeH / 2 - remainingDimB / 2,
    remainingDimA,
    remainingDimB
  )
}
function letterG(index, x, y, pieceSize, letterSize) {
  push()
  translate(x, y)
  fill(writingColor)
  gameOvrePiece(index, 0 + letterSize / 4, 0, letterSize / 2, pieceSize)
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 - pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0 + letterSize / 2, letterSize, pieceSize)
  gameOvrePiece(
    index,
    0 - letterSize / 2 + pieceSize / 2,
    0,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0 - letterSize / 2, letterSize, pieceSize)
  pop()
}
function letterO(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 - pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2 - pieceSize / 2,
    0,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 - pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0 + letterSize / 2, letterSize, pieceSize)
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 - letterSize / 2 + pieceSize / 2,
    0,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0 - letterSize / 2, letterSize, pieceSize)
  pop()
}
function letterA(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 - pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0, letterSize, pieceSize)
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 - pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2 - pieceSize / 2,
    0 + letterSize * 0.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 - letterSize / 2 + pieceSize / 2,
    0 + letterSize * 0.5,
    pieceSize,
    letterSize * 0.25
  )

  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0 - letterSize / 2, letterSize, pieceSize)
  pop()
}
function letterM(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  //right vertical
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 + pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2 + pieceSize / 2,
    0,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 + pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2 + pieceSize / 2,
    0 + letterSize * 0.5,
    pieceSize,
    letterSize * 0.25
  )
  //left vertical
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 - pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 - letterSize / 2 - pieceSize / 2,
    0,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 - pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 - letterSize / 2 - pieceSize / 2,
    0 + letterSize * 0.5,
    pieceSize,
    letterSize * 0.25
  )
  //top
  gameOvrePiece(
    index,
    0 - letterSize / 2,
    0 - letterSize / 2,
    letterSize / 2,
    pieceSize
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2,
    0 - letterSize / 2,
    letterSize / 2,
    pieceSize
  )
  //sinker
  gameOvrePiece(index + 1, 0, 0 - letterSize / 4, letterSize / 2, pieceSize)
  gameOvrePiece(index, 0, 0, pieceSize, pieceSize)

  pop()
}
function letterE(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(index, 0, 0 + letterSize / 2, letterSize, pieceSize)
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 - letterSize * 0.1,
    0,
    letterSize * 0.8,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0 - letterSize / 2, letterSize, pieceSize)
  pop()
}
function letterV(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  //left and right
  gameOvrePiece(
    index,
    0 - letterSize / 2 + pieceSize / 2,
    0 - letterSize / 2,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2 - pieceSize / 2,
    0 - letterSize / 2,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 - pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 - letterSize / 2 + pieceSize / 2,
    0,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2 - pieceSize / 2,
    0,
    pieceSize,
    letterSize * 0.25
  )
  //sinker
  gameOvrePiece(index + 1, 0, 0 + pieceSize, letterSize * 0.5, pieceSize)
  gameOvrePiece(index, 0, 0 + pieceSize * 2, pieceSize, pieceSize)
  pop()
}
function letterR(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 - pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0 - pieceSize / 2, 0, pieceSize * 3, pieceSize)
  gameOvrePiece(
    index + 1,
    0 + letterSize / 2 - pieceSize,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2 - pieceSize / 2,
    0 + letterSize * 0.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 - letterSize / 2 + pieceSize / 2,
    0 + letterSize * 0.5,
    pieceSize,
    letterSize * 0.25
  )

  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 - letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index + 1,
    0 - letterSize / 2 + pieceSize / 2,
    0 + letterSize / 4,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0 - letterSize / 2, letterSize, pieceSize)
  pop()
}
function letter1(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(index, 0, 0, pieceSize, letterSize * 0.25)
  // gameOvrePiece(index, 0, 0 - letterSize / 4, pieceSize, letterSize * 0.25)
  // gameOvrePiece(index + 1, 0, 0, pieceSize, letterSize * 0.25)
  // gameOvrePiece(index, 0, 0 + letterSize / 4, pieceSize, letterSize * 0.25)
  // gameOvrePiece(index + 1, 0, 0 + letterSize / 2, pieceSize, letterSize * 0.25)
  // gameOvrePiece(
  //   index + 1,
  //   0 - pieceSize,
  //   0 - letterSize / 3,
  //   pieceSize,
  //   letterSize * 0.25
  // )
  pop()
}
function letter2(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(
    index,
    0 - letterSize / 2.5,
    0 - letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2.5,
    0 + letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  // gameOvrePiece(index, 0, 0 + letterSize / 2, letterSize, pieceSize)
  // gameOvrePiece(
  //   index + 1,
  //   0 + letterSize / 2 - pieceSize / 2,
  //   0 - letterSize / 4,
  //   pieceSize,
  //   letterSize * 0.25
  // )
  // gameOvrePiece(index, 0, 0, letterSize, letterSize * 0.25)
  // gameOvrePiece(
  //   index + 1,
  //   0 - letterSize / 2 + pieceSize / 2,
  //   0 + letterSize / 4,
  //   pieceSize,
  //   letterSize * 0.25
  // )
  // gameOvrePiece(index, 0, 0 - letterSize / 2, letterSize, pieceSize)
  pop()
}
function letter3(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(
    index,
    0 - letterSize / 2.5,
    0 - letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0, pieceSize, letterSize * 0.25)
  gameOvrePiece(
    index,
    0 + letterSize / 2.5,
    0 + letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  // gameOvrePiece(
  //   index + 1,
  //   0 + letterSize / 2 - pieceSize / 2,
  //   0 - letterSize / 4,
  //   pieceSize,
  //   letterSize * 0.25
  // )
  // gameOvrePiece(
  //   index,
  //   0 + letterSize * 0.1,
  //   0,
  //   letterSize * 0.6,
  //   letterSize * 0.25
  // )
  // gameOvrePiece(
  //   index + 1,
  //   0 + letterSize / 2 - pieceSize / 2,
  //   0 + letterSize / 4,
  //   pieceSize,
  //   letterSize * 0.25
  // )
  // gameOvrePiece(index, 0, 0 - letterSize / 2, letterSize, pieceSize)
  pop()
}
function letter4(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(
    index,
    0 - letterSize / 2.5,
    0 - letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2.5,
    0 + letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 - letterSize / 2.5,
    0 + letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2.5,
    0 - letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  // gameOvrePiece(index, 0, 0, letterSize + pieceSize, pieceSize)
  // gameOvrePiece(index, 0 + pieceSize, 0 - letterSize / 2, pieceSize, pieceSize)
  // gameOvrePiece(
  //   index + 1,
  //   0 + pieceSize,
  //   0 - letterSize / 4,
  //   pieceSize,
  //   pieceSize
  // )
  // gameOvrePiece(index, 0 + pieceSize, 0 + letterSize / 2, pieceSize, pieceSize)
  // gameOvrePiece(
  //   index + 1,
  //   0 + pieceSize,
  //   0 + letterSize / 4,
  //   pieceSize,
  //   pieceSize
  // )
  // gameOvrePiece(
  //   index + 1,
  //   0 - letterSize / 2,
  //   0 - letterSize / 4,
  //   pieceSize,
  //   pieceSize
  // )
  // gameOvrePiece(
  //   index,
  //   0 - letterSize / 2,
  //   0 - letterSize / 2,
  //   pieceSize,
  //   pieceSize
  // )
  //gameOvrePiece(index+1, 0-letterSize/2, 0, pieceSize, pieceSize)
  pop()
}
function letter5(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(
    index,
    0 - letterSize / 2.5,
    0 - letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2.5,
    0 + letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0, 0, pieceSize, letterSize * 0.25)
  gameOvrePiece(
    index,
    0 - letterSize / 2.5,
    0 + letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2.5,
    0 - letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  // gameOvrePiece(index, 0, 0 + letterSize / 2, letterSize, pieceSize)
  // gameOvrePiece(index, 0, 0, letterSize, pieceSize)
  // gameOvrePiece(index, 0, 0 - letterSize / 2, letterSize, pieceSize)
  // gameOvrePiece(
  //   index + 1,
  //   0 - letterSize / 2 + pieceSize / 2,
  //   0 - letterSize / 4,
  //   pieceSize,
  //   pieceSize
  // )
  // gameOvrePiece(
  //   index + 1,
  //   0 + letterSize / 2 - pieceSize / 2,
  //   0 + letterSize / 4,
  //   pieceSize,
  //   pieceSize
  // )
  pop()
}
function letter6(index, x, y, pieceSize, letterSize) {
  push()
  fill(writingColor)
  translate(x, y)
  gameOvrePiece(
    index,
    0 - letterSize / 2.5,
    0 - letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2.5,
    0 + letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(index, 0 + letterSize / 2.5, 0, pieceSize, letterSize * 0.25)
  gameOvrePiece(index, 0 - letterSize / 2.5, 0, pieceSize, letterSize * 0.25)
  gameOvrePiece(
    index,
    0 - letterSize / 2.5,
    0 + letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  gameOvrePiece(
    index,
    0 + letterSize / 2.5,
    0 - letterSize / 2.5,
    pieceSize,
    letterSize * 0.25
  )
  // gameOvrePiece(index, 0, 0 + letterSize / 2, letterSize, pieceSize)
  // gameOvrePiece(index, 0, 0, letterSize, pieceSize)
  // gameOvrePiece(index, 0, 0 - letterSize / 2, letterSize, pieceSize)
  // gameOvrePiece(
  //   index + 1,
  //   0 - letterSize / 2 + pieceSize / 2,
  //   0 - letterSize / 4,
  //   pieceSize,
  //   pieceSize
  // )
  // gameOvrePiece(
  //   index + 1,
  //   0 + letterSize / 2 - pieceSize / 2,
  //   0 + letterSize / 4,
  //   pieceSize,
  //   pieceSize
  // )
  // gameOvrePiece(
  //   index + 1,
  //   0 - letterSize / 2 + pieceSize / 2,
  //   0 + letterSize / 4,
  //   pieceSize,
  //   pieceSize
  // )
  pop()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  updateGameOvrePath()
  // Regenerate odd-indexed boardGrids immediately
  for (let i = 0; i < 15; i++) {
    boardGrids[i].regenerate()
  }

  // Regenerate even-indexed boardGrids after 1 second delay
  setTimeout(() => {
    for (let i = 15; i < 36; i++) {
      boardGrids[i].regenerate()
    }
  }, 200)
}

function elevationBase(size, sizeHeight) {
  noFill()
  stroke(lineColor)
  strokeWeight(unit * 0.005)
  rect(0, 0, size, sizeHeight)
  line(0 - size / 2, 0 - sizeHeight / 2, 0 + size / 2, 0 + sizeHeight / 2)
  line(0 + size / 2, 0 - sizeHeight / 2, 0 - size / 2, 0 + sizeHeight / 2)
}

function elevationBase03(x, y, sizeW, sizeH) {
  noFill()
  stroke(lineColor)
  strokeWeight(unit * 0.005)
  rect(x, y, sizeW, sizeH)
  line(x - sizeW / 2, y - sizeH / 2, x + sizeW / 2, y + sizeH / 2)
  line(x + sizeW / 2, y - sizeH / 2, x - sizeW / 2, y + sizeH / 2)
}

//tile functions
//yet to do tilePattern01 and 03 options, if deemed valuable!

function tilePattern02(x, y, w, h) {
  push()
  if (backgroundMaterial == 'back of the cloth') {
    fill(0, 0, 0, 50)
    rect(x - unit / 50, y + unit / 50, w, h)
  }
  pop()
  rect(x, y, w, h)
  noStroke()
  if (backgroundMaterial !== 'back of the cloth') {
    fill(colorVariableH[1], 0, 100, tileAlpha) //saturation changed from 100
    rect(x, y, w * tileDesignProportionA)
    fill(0, 0, 100, tileAlpha)
    rect(x, y, w * tileDesignProportionA * 0.9)
  }

  // fill(0, 0, 100, 50)
  // rect(x, y, w * tileDesignProportionA*0.6)
  // fill(0, 0, 100, 50)
  // rect(x, y, w * tileDesignProportionA*0.4)

  offsetSquareSize =
    (w - w * tileDesignProportionA - w * tileDesignProportionB) / 2
  offsetSquarePos = w * tileDesignProportionA * 0.5 + offsetSquareSize * 0.5
  offsetMini = w * tileDesignProportionB
  noStroke()
  rect(x - offsetSquarePos, y - offsetSquarePos, offsetSquareSize)
  rect(x + offsetSquarePos, y - offsetSquarePos, offsetSquareSize)
  rect(x - offsetSquarePos, y + offsetSquarePos, offsetSquareSize)
  rect(x + offsetSquarePos, y + offsetSquarePos, offsetSquareSize)
  if (offsetSquareSize > w * 0.3) {
    fill(backgroundColor)
    noStroke()
    rect(
      x - offsetSquarePos - offsetMini,
      y - offsetSquarePos - offsetMini,
      offsetSquareSize * 0.5
    )
    rect(
      x + offsetSquarePos + offsetMini,
      y - offsetSquarePos - offsetMini,
      offsetSquareSize * 0.5
    )
    rect(
      x - offsetSquarePos - offsetMini,
      y + offsetSquarePos + offsetMini,
      offsetSquareSize * 0.5
    )
    rect(
      x + offsetSquarePos + offsetMini,
      y + offsetSquarePos + offsetMini,
      offsetSquareSize * 0.5
    )
    fill(colorVariableH[3], 0, 100, tileAlpha) //saturation changed from 100
    noStroke()
    rect(
      x - offsetSquarePos - offsetMini,
      y - offsetSquarePos - offsetMini,
      offsetSquareSize * 0.2
    )
    rect(
      x + offsetSquarePos + offsetMini,
      y - offsetSquarePos - offsetMini,
      offsetSquareSize * 0.2
    )
    rect(
      x - offsetSquarePos - offsetMini,
      y + offsetSquarePos + offsetMini,
      offsetSquareSize * 0.2
    )
    rect(
      x + offsetSquarePos + offsetMini,
      y + offsetSquarePos + offsetMini,
      offsetSquareSize * 0.2
    )
  }
}

function panelSingle(x, y, w, h, greyScale) {
  push()
  translate(x, y)
  // fill(0, 0, greyScale, 255)
  // fill(0, 0, 100, 255)
  rect(0, 0, w, h)
  noStroke()
  //hooks
  fill(backgroundColor) //black
  rect(0 - w / 2, 0, w * 0.2, h * 0.2)
  rect(0 + w / 2, 0, w * 0.2, h * 0.2)
  rect(0, 0 + h / 2, w * 0.2, h * 0.2)
  rect(0, 0 - h / 2, w * 0.2, h * 0.2)
  pop()
}
///this function has hl.random instances throughout
function initializeGridProportions() {
  wallCols = Math.floor(random(1, 7)) //hl.
  wallRows = Math.floor(random(1, 7)) //hl.
  colProportions = []
  rowProportions = []
  totalColProportion = 0
  totalRowProportion = 0
  // Initialize proportions for columns
  for (let i = 0; i < wallCols; i++) {
    let colProportion = random(0.1, 0.3) // Relative proportions for each column //hl.
    colProportions.push(colProportion)
    totalColProportion += colProportion // Sum of proportions
  }
  // Initialize proportions for rows
  for (let j = 0; j < wallRows; j++) {
    let rowProportion = random(0.1, 0.3) // Relative proportions for each row //hl.
    rowProportions.push(rowProportion)
    totalRowProportion += rowProportion // Sum of proportions
  }
}

function eachPanel(w, h) {
  rect(0, 0, w, h) // Draw each individual panel
  noStroke()
}

///this class has hl.random instances throughout, except for runRegeneration()
class boardGrid {
  constructor(x, y) {
    this.x = x // X position of this grid
    this.y = y // Y position of this grid
    this.isRegenerating = false // Track if this grid is regenerating
    this.currentCount = 0 // Counter for regenerations
    this.gridSize = gridWidth * 2
    this.colorOffset = floor(random(0, colorVariableH.length)) //hl.

    // Store unique grid properties
    this.wallCols = Math.floor(random(1, 7)) //hl.
    this.wallRows = Math.floor(random(1, 7)) //hl.
    this.colProportions = []
    this.rowProportions = []
    this.totalColProportion = 0
    this.totalRowProportion = 0
    this.rowInset = []
    this.colInset = []
    this.insetYesNo = []

    // Generate random proportions
    for (let i = 0; i < this.wallCols; i++) {
      this.colProportions.push(random(0.1, 1)) //hl.
      this.totalColProportion += this.colProportions[i]
    }
    for (let j = 0; j < this.wallRows; j++) {
      this.rowProportions.push(random(0.1, 1)) //hl.
      this.totalRowProportion += this.rowProportions[j]
    }
    for (let j = 0; j < 51; j++) {
      this.colInset.push(random(0.1, 1)) //hl.
      this.rowInset.push(random(0.1, 1)) //hl.
      this.insetYesNo.push(random(1)) //hl.
    }
  }

  draw() {
    push()
    translate(this.x, this.y)
    drawBoard(this)
    pop()
  }

  regenerate() {
    if (!this.isRegenerating) {
      this.isRegenerating = true
      this.currentCount = 0
      this.runRegeneration()
    }
  }

  runRegeneration() {
    if (this.currentCount < maxRegenerations) {
      let progress = this.currentCount / maxRegenerations
      let interval = baseInterval + progress * (maxInterval - baseInterval)

      this.currentCount++

      // Re-generate the grid values for a new pattern
      this.wallCols = Math.floor(random(1, 7))
      this.wallRows = Math.floor(random(1, 7))
      this.colProportions = []
      this.rowProportions = []
      this.totalColProportion = 0
      this.totalRowProportion = 0
      this.rowInset = []
      this.colInset = []
      this.insetYesNo = []

      for (let i = 0; i < this.wallCols; i++) {
        this.colProportions.push(random(0.1, 1))
        this.totalColProportion += this.colProportions[i]
      }
      for (let j = 0; j < this.wallRows; j++) {
        this.rowProportions.push(random(0.1, 1))
        this.totalRowProportion += this.rowProportions[j]
      }
      for (let j = 0; j < 51; j++) {
        this.colInset.push(random(0.1, 1))
        this.rowInset.push(random(0.1, 1))
        this.insetYesNo.push(random(1))
      }

      setTimeout(() => this.runRegeneration(), interval)
    } else {
      this.isRegenerating = false
    }
  }
}

function drawBoard(grid) {
  let {
    wallCols,
    wallRows,
    colProportions,
    rowProportions,
    totalColProportion,
    totalRowProportion,
    rowInset,
    colInset,
    insetYesNo,
  } = grid

  let wallSize = crossUnit
  let yPos = 0 - wallSize / 2

  for (let j = 0; j < wallRows; j++) {
    let xPos = 0 - wallSize / 2
    let rowHeight = (rowProportions[j] / totalRowProportion) * crossUnit * 0.5

    let colorIndex = (grid.colorOffset + j) % colorVariableH.length
    fill(
      colorVariableH[colorIndex],
      colorVariableS[colorIndex],
      colorVariableB[colorIndex],
      255
    )
    noStroke()

    for (let i = 0; i < wallCols; i++) {
      let colWidth = (colProportions[i] / totalColProportion) * crossUnit * 0.5

      push()
      translate(xPos + colWidth / 2, yPos + rowHeight / 2)

      if (insetYesNo[i] < numberInsets) {
        elevationBase(colWidth, rowHeight)
        let insetColorIndex = (grid.colorOffset + i) % colorVariableH.length
        fill(
          colorVariableH[insetColorIndex],
          colorVariableS[insetColorIndex],
          colorVariableB[insetColorIndex],
          255
        )
        eachPanel(colWidth * colInset[i], rowHeight * rowInset[i]) //

        fill(
          colorVariableH[insetColorIndex],
          colorVariableS[insetColorIndex],
          colorVariableB[insetColorIndex],
          255
        )
        extraInsetBitW = (colWidth - colWidth * colInset[i]) / 2
        extraInsetBitH = (rowHeight - rowHeight * rowInset[i]) / 2

        rect(
          0 - colWidth / 2 + extraInsetBitW / 2,
          0 - rowHeight / 2 + extraInsetBitH / 2,
          extraInsetBitW,
          extraInsetBitH
        )
        rect(
          0 - colWidth / 2 + extraInsetBitW / 2,
          0 + rowHeight / 2 - extraInsetBitH / 2,
          extraInsetBitW,
          extraInsetBitH
        )
        rect(
          0 + colWidth / 2 - extraInsetBitW / 2,
          0 - rowHeight / 2 + extraInsetBitH / 2,
          extraInsetBitW,
          extraInsetBitH
        )
        rect(
          0 + colWidth / 2 - extraInsetBitW / 2,
          0 + rowHeight / 2 - extraInsetBitH / 2,
          extraInsetBitW,
          extraInsetBitH
        )
      } else {
        eachPanel(colWidth, rowHeight)
      }
      pop()

      xPos += colWidth
    }
    yPos += rowHeight
  }
}

function eachGamePiece(x, y, size, colorIndex, index, location) {
  let tiles = gamePiecesTiles[index] // Get this piece's grid
  let tileMinis = gamePiecesMinis[index] // Get its grid size

  //size of overlay grids
  let fixedOverlaySize = size * 1 // Keep overlay grid proportional but fixed
  let tileEachPieceSize = fixedOverlaySize / tileMinis // Adjust each tile's size

  push()
  translate(x, y)
  //   //translate(shiftX, shiftY);
  if (location == heavenColor) {
    //0.4
    fill(backgroundBoxColor)
    stroke(backgroundBoxColor)
  } else {
    fill(basementColor)
    stroke(basementColor)
  }
  //fill(colorVariableH[colorIndex], 50, 80, 255)
  //tilePattern02(shiftX, shiftY, adjustedSize, adjustedSize) //size modified to be unique to each instance
  //rect(shiftX, shiftY, adjustedSize, adjustedSize)
  if (backgroundMaterial == 'back of the cloth') {
    fill(gamePieceMario)
  }

  // fill(0,0,100,20)
  // rect(shiftX, shiftY, adjustedSize, adjustedSize*0.5)
  rect(0, 0, size, size)

  // Overlay grid
  for (let t = 0; t < tiles.length; t++) {
    let col = t % tileMinis // Column index
    let row = Math.floor(t / tileMinis) // Row index

    let tileX =
      col * tileEachPieceSize - fixedOverlaySize / 2 + tileEachPieceSize / 2
    let tileY =
      row * tileEachPieceSize - fixedOverlaySize / 2 + tileEachPieceSize / 2

    if (tiles[t]) {
      if (location == heavenColor) {
        fill(gamePieceTop)
        noStroke()
      } else {
        fill(gamePieceBottom)
        noStroke()
      }
    } else {
      noFill()
      noStroke()
    }

    rect(tileX, tileY, tileEachPieceSize * 1.1, tileEachPieceSize * 1.1) //modify to reflect each instance
  }

  if (location == heavenColor) {
    //0.4
    fill(gamePieceTop)
    stroke(gamePieceTop)
  } else {
    fill(gamePieceBottom)
    stroke(gamePieceBottom)
  }
  if (backgroundMaterial == 'back of the cloth') {
    fill(gamePieceMarioSkin)
  }
  // noStroke()
  rect(0, 0, tileEachPieceSize * 1)
  pop()
}

function eachGamePieceB(x, y, size, colorIndex, index, location) {
  let tiles = gamePiecesTiles[index] // Get this piece's grid
  let tileMinis = gamePiecesMinis[index] // Get its grid size
  let scaleFactor = gamePiecesScale[index] // Fixed scale factor
  let shiftX = gamePiecesShiftX[index] // Fixed shift X
  let shiftY = gamePiecesShiftY[index] // Fixed shift Y

  let adjustedSize = size * scaleFactor // Adjusted size

  //size of overlay grids
  let fixedOverlaySize = size * 1.1 // Keep overlay grid proportional but fixed
  let tileEachPieceSize = fixedOverlaySize / tileMinis // Adjust each tile's size

  push()
  translate(x, y)
  //   //translate(shiftX, shiftY);
  if (location == heavenColor) {
    //0.4
    fill(gamePieceTop)
  } else {
    fill(gamePieceBottom)
  }
  //fill(colorVariableH[colorIndex], 50, 80, 255)
  //tilePattern02(shiftX, shiftY, adjustedSize, adjustedSize) //size modified to be unique to each instance
  rect(shiftX, shiftY, adjustedSize, adjustedSize)

  // Overlay grid
  for (let t = 0; t < tiles.length; t++) {
    let col = t % tileMinis // Column index
    let row = Math.floor(t / tileMinis) // Row index

    let tileX =
      col * tileEachPieceSize - fixedOverlaySize / 2 + tileEachPieceSize / 2
    let tileY =
      row * tileEachPieceSize - fixedOverlaySize / 2 + tileEachPieceSize / 2

    if (tiles[t]) {
      if (location == heavenColor) {
        fill(backgroundBoxColor)
      } else {
        fill(basementColor)
      }
      noStroke()
    } else {
      noFill()
      noStroke()
    }

    rect(tileX, tileY, tileEachPieceSize * 1.1, tileEachPieceSize * 1.1) //modify to reflect each instance
  }

  if (location == heavenColor) {
    //0.4
    fill(gamePieceTop)
  } else {
    fill(gamePieceBottom)
  }
  noStroke()
  rect(0, 0, tileEachPieceSize * 1.2)
  pop()
}

function drawSnakes(boardColumns, boardRows) {
  noFill()
  for (let s of snakes) {
    let headIndex = getRealIndex(s.head) // Adjust head position for zigzag
    let tailIndex = getRealIndex(s.tail) // Adjust tail position for zigzag

    let colHead = headIndex % 6
    let rowHead = floor(headIndex / 6)
    let colTail = tailIndex % 6
    let rowTail = floor(tailIndex / 6)

    let x1 = boardColumns[colHead] - crossUnit * 0.25
    let y1 = boardRows[rowHead] - crossUnit * 0.25
    let x2 = boardColumns[colTail] - crossUnit * 0.25
    let y2 = boardRows[rowTail] - crossUnit * 0.25
    // Calculate the midpoint between p1 and p2 for the arc control points
    let midX = (x1 + x2) / 2
    let midY = (y1 + y2) / 2
    let controlX1 = (x1 + midX) / 2
    let controlY1 = y1
    let controlX2 = (x2 + midX) / 2
    let controlY2 = y2

    let boneSpacing = unit * 0.08

    // Calculate arc lengths
    let arcLength1 = estimateQuadraticBezierLength(
      x1,
      y1,
      controlX1,
      controlY1,
      midX,
      midY
    )
    let arcLength2 = estimateQuadraticBezierLength(
      midX,
      midY,
      controlX2,
      controlY2,
      x2,
      y2
    )

    // Calculate number of bones dynamically
    let numBones1 = max(2, floor(arcLength1 / boneSpacing))
    let numBones2 = max(2, floor(arcLength2 / boneSpacing))

    // Draw bones along the first arc
    let boneSize = unit * 0.075
    for (let i = 0; i <= numBones1; i++) {
      let t = i / numBones1
      let x = quadraticLerp(x1, controlX1, midX, t)
      let y = quadraticLerp(y1, controlY1, midY, t)
      let dx = quadraticLerpDerivative(x1, controlX1, midX, t)
      let dy = quadraticLerpDerivative(y1, controlY1, midY, t)
      let angle = atan2(dy, dx)
      if (i === 1) {
        fill(donkeyKongSnake)
        noStroke()
        snakeHead(x, y, boneSize, angle)
      } else if (i === 0) {
        fill(donkeyKongSnake)
        gameOvrePiece(i, x, y, boneSize * 0.5, boneSize * 0.5)
      } else {
        fill(donkeyKongSnake)
        drawRotatedSnakeBone(i, x, y, boneSize, boneSize, angle)
      }
      noStroke()
    }

    // Draw bones along the second arc (gradual decrease size here)
    let startSize = unit * 0.075 // Initial bone size
    let endSize = unit * 0.02 // Final (smallest) bone size
    for (let i = 0; i <= numBones2; i++) {
      let t = i / numBones2
      let x = quadraticLerp(midX, controlX2, x2, t)
      let y = quadraticLerp(midY, controlY2, y2, t)
      let dx = quadraticLerpDerivative(midX, controlX2, x2, t)
      let dy = quadraticLerpDerivative(midY, controlY2, y2, t)
      let angle = atan2(dy, dx)
      let boneSize2 = lerp(startSize, endSize, t)
      if (i === numBones2) {
      } else {
        fill(donkeyKongSnake)
        drawRotatedSnakeBone(i, x, y, boneSize, boneSize2, angle)
      }
    }
  }
}

function snakeHead(x, y, size, angle) {
  push()
  translate(x, y)
  rotate(angle)
  scale(0.7)

  beginShape()
  vertex(0 - size * 0.5, 0 - size * 1)
  vertex(0 - size * 2.5, 0 - size * 0.3)
  vertex(0 - size * 2.5, 0 + size * 0.3)
  vertex(0 - size * 0.5, 0 + size * 1)
  endShape(CLOSE)

  rect(0 - size * 0.3, 0 - size * 0.75, size * 0.5)
  rect(0 - size * 0.3, 0 + size * 0.75, size * 0.5)

  fill(backgroundBoxColor)
  rect(0 - size * 1, 0, size * 0.4, size * 0.8)

  pop()
}

function drawRotatedSnakeBone(index, x, y, sizeW, sizeH, angle) {
  push()
  translate(x, y)
  rotate(angle)
  rectMode(CENTER)
  gameOvrePiece(index, 0, 0, sizeW, sizeH)
  pop()
}

// Approximate the length of a quadratic Bézier curve using segment distances
function estimateQuadraticBezierLength(x0, y0, cx, cy, x1, y1, segments = 10) {
  let length = 0
  let prevX = x0,
    prevY = y0

  for (let i = 1; i <= segments; i++) {
    let t = i / segments
    let x = quadraticLerp(x0, cx, x1, t)
    let y = quadraticLerp(y0, cy, y1, t)
    length += dist(prevX, prevY, x, y)
    prevX = x
    prevY = y
  }
  return length
}

// Function to interpolate along a quadratic Bézier curve
function quadraticLerp(p0, p1, p2, t) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2
}

// Function to get the derivative (tangent direction) of the quadratic Bézier curve
function quadraticLerpDerivative(p0, p1, p2, t) {
  return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1)
}

function drawLadders(boardColumns, boardRows) {
  for (let l of ladders) {
    let bottomIndex = getRealIndex(l.bottom) // Adjust bottom position for zigzag
    let topIndex = getRealIndex(l.top) // Adjust top position for zigzag

    let colBottom = bottomIndex % 6
    let rowBottom = floor(bottomIndex / 6)
    let colTop = topIndex % 6
    let rowTop = floor(topIndex / 6)

    let x1 = boardColumns[colBottom] - crossUnit * 0.25
    let y1 = boardRows[rowBottom] - crossUnit * 0.25
    let x2 = boardColumns[colTop] - crossUnit * 0.25
    let y2 = boardRows[rowTop] - crossUnit * 0.25

    // Calculate perpendicular offset direction
    let dx = x2 - x1
    let dy = y2 - y1
    let length = sqrt(dx * dx + dy * dy)

    // Normalize and scale by unit * 1
    let offsetX = (dy / length) * (unit * 0.02)
    let offsetY = (-dx / length) * (unit * 0.02)

    stroke(donkeyKongLadder)
    strokeWeight(unit * 0.01)

    // Draw the two parallel ladder sides
    let x1A = x1 - offsetX,
      y1A = y1 - offsetY
    let x2A = x2 - offsetX,
      y2A = y2 - offsetY
    let x1B = x1 + offsetX,
      y1B = y1 + offsetY
    let x2B = x2 + offsetX,
      y2B = y2 + offsetY

    line(x1A, y1A, x2A, y2A)
    line(x1B, y1B, x2B, y2B)

    // Add rungs
    let rungSpacing = unit * 0.1
    let numRungs = floor(length / rungSpacing)

    for (let i = 0; i <= numRungs; i++) {
      let t = i / numRungs
      let rungX1 = lerp(x1A, x2A, t)
      let rungY1 = lerp(y1A, y2A, t)
      let rungX2 = lerp(x1B, x2B, t)
      let rungY2 = lerp(y1B, y2B, t)

      line(rungX1, rungY1, rungX2, rungY2)
    }
  }
}

function getRealIndex(position) {
  let row = floor(position / 6)
  let col = position % 6

  // Reverse column order for odd-numbered rows
  if (row % 2 === 1) {
    col = 5 - col
  }

  return row * 6 + col // Return correct mapped index
}

function drawPlayer(boardColumns, boardRows) {
  let realIndex = getRealIndex(playerPos)
  let col = realIndex % 6
  let row = floor(realIndex / 6)

  let x =
    lerp(boardColumns[col], boardColumns[col], moveProgress) - crossUnit * 0.25
  let y = lerp(boardRows[row], boardRows[row], moveProgress) - crossUnit * 0.25

  if (cycleCount >= 0) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 0, heavenColor)
  }
  if (cycleCount >= 1) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 1, heavenColor)
  }
  if (cycleCount >= 2) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 2, heavenColor)
  }
  if (cycleCount >= 3) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 3, heavenColor)
  }
  if (cycleCount >= 4) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 4, heavenColor)
  }
  if (cycleCount >= 5) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 5, heavenColor)
  }
  if (cycleCount >= 6) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 6, heavenColor)
  }
  if (cycleCount >= 7) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 7, heavenColor)
  }
  if (cycleCount >= 8) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 8, heavenColor)
  }
  if (cycleCount >= 9) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 9, heavenColor)
  }
  if (cycleCount >= 10) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 10, heavenColor)
  }
  if (cycleCount >= 11) {
    eachGamePiece(x, y, gridWidth * 0.5, 0, 11, heavenColor)
  }
  if (cycleCount >= 12) {
    eachGamePiece(-unit, -unit, gridWidth * 0.5, 0, 11, heavenColor)
  }
}

// Display the dice roll in the top-right corner
function displayDiceRoll(x, y) {
  if (diceRoll == 1) {
    letter1(1, x, y, crossUnit * 0.1, crossUnit * 0.4)
  }
  if (diceRoll == 2) {
    letter2(1, x, y, crossUnit * 0.1, crossUnit * 0.4)
  }
  if (diceRoll == 3) {
    letter3(1, x, y, crossUnit * 0.1, crossUnit * 0.4)
  }
  if (diceRoll == 4) {
    letter4(1, x, y, crossUnit * 0.1, crossUnit * 0.4)
  }
  if (diceRoll == 5) {
    letter5(1, x, y, crossUnit * 0.1, crossUnit * 0.4)
  }
  if (diceRoll == 6) {
    letter6(1, x, y, crossUnit * 0.1, crossUnit * 0.4)
  }
}

function rollDice() {
  diceRoll = floor(random(1, 7))
}

// Prepares movement queue for step-by-step movement
function prepareMovementQueue() {
  movementQueue = []
  let tempPos = playerPos
  for (let i = 0; i < diceRoll; i++) {
    if (tempPos < 47) {
      //maybe change to 48 to test
      tempPos++
      movementQueue.push(tempPos)
    }
  }
  // If the roll would go beyond 47, ensure the player lands exactly at 47
  if (tempPos >= 47 && movementQueue[movementQueue.length - 1] !== 47) {
    movementQueue.push(47)
  }
}

// Moves player step-by-step smoothly
function smoothMovePlayer() {
  if (movementQueue.length > 0) {
    moveProgress += moveSpeed
    if (moveProgress >= 1) {
      playerPos = movementQueue.shift()
      moveProgress = 0
    }
  } else {
    checkSnakesAndLadders()
    moving = false
    delayCounter = moveDelay
    if (playerPos >= 47) {
      playerPos = 0 // Reset to grid #1
      cycleCount++ // Increment cycle count

      //Stop game after 12 full cycles
      // if (cycleCount >= totalCycles) {
      //   gameOver = true
      // }
    }
  }
}

// Check if player lands on a snake or ladder
function checkSnakesAndLadders() {
  let realIndex = getRealIndex(playerPos) // Get actual mapped index
  for (let s of snakes) {
    if (realIndex === getRealIndex(s.head)) {
      playerPos = s.tail
    }
  }
  for (let l of ladders) {
    if (realIndex === getRealIndex(l.bottom)) {
      playerPos = l.top
    }
  }
}
