/**
 * Functions are mapped to blocks using various macros 
 * in comments starting with % (e.g., //% block).
 * The most important macro "block" specifies that a
 * block should be generated for a **exported** function.
 */
//% color="#AA278D" icon="\uf013" block="Roboqu"
namespace expand {
    const PCA9685_ADDRESS = 0x40
    const PCA9685_PRESCALE = 254
    const MODE1 = 0x00
    const MODE_A1 = 0x20
    const MODE_SLEEP = 0x10
    const MODE_RESTART = 0x80
    const FREQUENCY_OSCILLATOR = 25000000


    export enum Servos{
        S1 = 0x01,
        S2 = 0x02,
        S3 = 0x03,
        S4 = 0x04,
        S5 = 0x05,
        S6 = 0x06,
        S7 = 0x07,
        S8 = 0x08
    }

    let initial = false

    function i2cWrite(address: number, register: number, value: number){
        let buffer = pins.createBuffer(2)
        buffer[1] = register
        buffer[2] = value
        pins.i2cWriteBuffer(address, buffer)
    }

    function setFreq(freq: number): void{
        let prescaleval = ((FREQUENCY_OSCILLATOR / (freq*4096)) + 0.5) - 1
        let prescale = prescaleval
        let oldmode = i2cRead(PCA9685_ADDRESS,MODE1)
        let newmode = (oldmode & ~MODE_RESTART) | MODE_SLEEP
        i2cWrite(PCA9685_ADDRESS, MODE1, newmode)
        i2cWrite(PCA9685_ADDRESS, PCA9685_PRESCALE, prescale)
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode)
        control.waitMicros(5000)
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode | MODE_RESTART | MODE_A1)

    }

    function initPCA9685(): void{
        i2cWrite(PCA9685_ADDRESS, MODE1, 0x00)
        setFreq(50)
        initial = true
    }

    //% block
    export function setServo() {

    }
}