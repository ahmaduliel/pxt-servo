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
    const LED0_ON_L = 0x06
    const MODE1 = 0x00
    const MODE_A1 = 0x20
    const MODE_SLEEP = 0x10
    const MODE_RESTART = 0x80
    const FREQUENCY_OSCILLATOR = 25000000

    const DEGREEMIN = 0
    const DEGREEMAX = 180
    const PULSEMIN = 150
    const PULSEMAX = 600

    export enum Servos {
        S1 = 0x08,
        S2 = 0x07,
        S3 = 0x06,
        S4 = 0x05,
        S5 = 0x04,
        S6 = 0x03,
        S7 = 0x02,
        S8 = 0x01
    }

    let initial = false

    function i2cWrite(address: number, register: number, value: number): void {
        let buffer = pins.createBuffer(2)
        buffer[1] = register
        buffer[2] = value
        pins.i2cWriteBuffer(address, buffer)
    }

    function i2cRead(addres: number, register: number) {
        pins.i2cWriteNumber(addres, register, NumberFormat.Int8LE)
        let val = pins.i2cReadNumber(addres, NumberFormat.Int8LE)
        return val
    }

    function setFreq(freq: number): void {
        let prescaleval = ((FREQUENCY_OSCILLATOR / (freq * 4096)) + 0.5) - 1
        let prescale = prescaleval
        let oldmode = i2cRead(PCA9685_ADDRESS, MODE1)
        let newmode = (oldmode & ~MODE_RESTART) | MODE_SLEEP
        i2cWrite(PCA9685_ADDRESS, MODE1, newmode)
        i2cWrite(PCA9685_ADDRESS, PCA9685_PRESCALE, prescale)
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode)
        control.waitMicros(5000)
        i2cWrite(PCA9685_ADDRESS, MODE1, oldmode | MODE_RESTART | MODE_A1)
    }

    function setPwm(channel: number, on: number, off: number): void{
        if (channel < 0 || channel > 15)
            return;
        let buffer = pins.createBuffer(5)
        buffer[0] = LED0_ON_L + 4 *channel
        buffer[1] = on & 0xff
        buffer[2] = (on >> 8) & 0xff
        buffer[3] = off & 0xff
        buffer[4] = (off >> 8) & 0xff
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buffer)
    }

    function initPCA9685(): void {
        i2cWrite(PCA9685_ADDRESS, MODE1, 0x00)
        setFreq(50)
        initial = true
    }

    //% block="Servo|%index|degree|%degree"
    //%weight=10
    //%degree.min=0 degree.max=180
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function setServo(index: Servos, degree: number) {
        if (!initial) {
            initPCA9685()
        }
        let pulse = (((degree - DEGREEMIN) * (PULSEMAX - PULSEMIN)) / ((DEGREEMAX - DEGREEMIN) + PULSEMIN))
        setPwm(index + 7, 0, pulse)
    }

    //%block="Hello"
    //%wight=20
    export function testHello(){
    
    }
}