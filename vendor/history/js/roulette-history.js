function getInteger(position, data) {
    return ((data[position + 3]) | (data[position + 2] << 8) | (data[position + 1] << 16) | (data[position] << 24));
}

let rouletteAnimator = function () {
    let canvas = $$('#chips-canvas');
    let CHIP_SIZE_HEIGHT;
    let CHIP_SIZE_WIDTH;
    let chipImage = new Image();
    let context = canvas.getContext('2d');
    chipImage.src = 'images/chips/chip.png';
    let chipsData = [];

    function resize() {
        // Set new canvas size
        let mainSection = $$('#game-screen');
        canvas.width = mainSection.clientWidth * 0.99 * window.devicePixelRatio;
        canvas.height = mainSection.clientHeight * 0.628 * window.devicePixelRatio;
        // Set new chip positions
        let newWidth = canvas.width / 28;
        let newHeight = canvas.height / 10;
        chipsData.forEach(function (chip) {
            chip.position.x *= newWidth / CHIP_SIZE_WIDTH;
            chip.position.y *= newHeight / CHIP_SIZE_HEIGHT;
        }, this);
        CHIP_SIZE_WIDTH = newWidth;
        CHIP_SIZE_HEIGHT = newHeight;
        // Redraw chips
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        for (let i = 0; i < chipsData.length; ++i) {
            drawChip(chipsData[i]);
        }
        context.restore();
    }

    function parseBetsData(betsData) {
        let betsMatrix = preparseBetsData(betsData);
        chipsData = [];
        for (let i = 0; i < betsMatrix.length; ++i)
            for (let j = 0; j < betsMatrix[i].length; ++j)
                if (betsMatrix[i][j] > 0) {
                    let position = { x: 0, y: 0 };
                    position.x = (0.5 + j) * CHIP_SIZE_WIDTH;
                    position.y = (0.5 + i) * CHIP_SIZE_HEIGHT;
                    if (j === 25) {
                        position.x += CHIP_SIZE_WIDTH;
                    }
                    if (i === 7) {
                        position.y += CHIP_SIZE_HEIGHT;
                    }
                    // In American roulette zero and double zero chips are moved a bit
                    if (isAmericanRoulette && j === 0) {
                        if (i === 1) {
                            position.y -= 0.5 * CHIP_SIZE_HEIGHT;
                        }
                        if (i === 3) {
                            position.y += 0.5 * CHIP_SIZE_HEIGHT;
                        }
                    }
                    chipsData.push({
                        value: betsMatrix[i][j],
                        position: position
                    });
                }
    }

    function preparseBetsData(betsData) {
        let bets = [];
        let counter = 0;
        for (let i = 0; i < 8; ++i) {
            bets[i] = [];
            for (let j = 0; j < 26; ++j) {
                bets[i][j] = getInteger(counter, betsData);
                counter += 4;
            }
        }
        return bets;
    }

    function drawChips(betsMatrix) {
        resize();
        parseBetsData(betsMatrix);
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        for (let i = 0; i < chipsData.length; ++i) {
            drawChip(chipsData[i]);
        }
        context.restore();
    }

    function drawChip(data) {
        if (data.value === 0)
            return;
        context.save();
        context.strokeStyle = 'black';
        context.fillStyle = 'black';
        context.clearRect(data.position.x, data.position.y, CHIP_SIZE_WIDTH, CHIP_SIZE_HEIGHT);
        context.drawImage(chipImage, 0, 0, 60, 60, data.position.x, data.position.y, CHIP_SIZE_WIDTH, CHIP_SIZE_HEIGHT);
        setChipFont(formatBigMoney(data.value));
        context.fillText(formatBigMoney(data.value), data.position.x + CHIP_SIZE_WIDTH / 2, data.position.y + CHIP_SIZE_HEIGHT / 2);
        context.restore();
    }

    function setChipFont(text) {
        text = text.toString();
        let textLength = text.length;
        let textCoefficient = 0;
        switch (textLength) {
            case 1:
                textCoefficient = 1.6;
                break;
            case 2:
                textCoefficient = 1.6;
                break;
            case 3:
                textCoefficient = 2.1;
                break;
            case 4:
                textCoefficient = 2.6;
                break;
            case 5:
                textCoefficient = 3.1;
                break;
            case 6:
                textCoefficient = 3.6;
                break;
            case 7:
                textCoefficient = 4.5;
                break;
        }
        context.font = `${CHIP_SIZE_WIDTH / (textCoefficient * 1.1)}px Roboto`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
    }

    return {
        resize,
        drawChips
    };
}();