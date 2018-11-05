import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const math = require('mathjs');


/**
 * Screen
 */
class Screen extends Component {
    render() {
        return (
            <div id="screen" >
                <div id="display">{this.props.display}</div>
                <div id="total">{this.props.total}</div>
            </div>
        )
    }
}



/**
 * Bar
 */
class Bar extends Component {
    render() {
        return (
            <div id="bar" >
                <span id="back" onClick={this.props.back}>BACK</span>
            </div>
        )
    }
}


/**
 * Inputs
 */
class Inputs extends Component {
    render() {
        const inputs = [
            ['AC', 'clear', 'AC', 'clear'], ['x²', 'squared', '²', 'squared'], ['%', 'Mod', '%', 'operation'], ['÷', 'divide', '/', 'operation'], 
            ['7', 'seven', 7, 'number'], ['8', 'eight', 8, 'number'], ['9', 'nine', 9, 'number'], ['−', 'subtract', '-', 'operation'],
            ['4', 'four', 4, 'number'], ['5', 'five', 5, 'number'], ['6', 'six', 6, 'number'], ['×', 'multiply', '*', 'operation'],
            ['1', 'one', 1, 'number'], ['2', 'two', 2, 'number'], ['3', 'three', 3, 'number'], ['+', 'add', '+', 'operation'],
            ['√', 'squareroot', '√', 'squareroot'], ['0', 'zero', 0, 'zero'], ['.', 'decimal', '.', 'decimal'], ['=', 'equals', '=', 'equals']
        ];
        return (
            <div className="grid">
                {inputs.map((input, i) => {
                    return <div className={`grid-item ${input[3]}`} id={input[1]} data-key={input[0]} data-value={input[2]} data-type={input[3]}  onClick={this.props.handleInput} key={i}>{input[0]}</div>
                })}
            </div>
        )
    }
}



/**
 * Calculator
 */
class Calculator extends Component {

    constructor() {
        super();

        this.state = {
            display: '0',
            sum: '0',
            total: '0',
            init: true,
            newsum: ''
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleSquared = this.handleSquared.bind(this);
        this.handleSquaredRoot = this.handleSquareRoot.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
        this.handleZero = this.handleZero.bind(this);
        this.handleNumber = this.handleNumber.bind(this);
        this.handleOperation = this.handleOperation.bind(this);
        this.handleEval = this.handleEval.bind(this);
        this.handleEquals = this.handleEquals.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    // Methods
    handleInput(input) {

        switch (input.target.dataset.type) {
            case 'squared':
                this.handleSquared();
                break;
            case 'squareroot': 
                this.handleSquareRoot();
                break;
            case 'zero': 
                this.handleZero();
                break;
            case 'decimal': 
                this.handleDecimal();
                break;
            case 'number':
                this.handleNumber(input);
                break; 
            case 'operation': 
                this.handleOperation(input);
                break;
            case 'equals':
                this.handleEquals();
                break; 
            case 'clear': 
                this.handleClear();
                break;
            default:
                break;
        }
    }

    
    handleSquared() {
        let sum = this.state.sum;
        let regex = /[0-9]{1}$/gm;
        let isNumber = regex.test(sum);

        if (!isNumber) {
            return false;
        }

        sum = math.eval(sum);
        sum = sum * sum;

        this.setState({
            display: sum,
            sum: sum,
            total: sum,
            init: true
        });
    }
    
    handleSquareRoot() {
        let sum = this.state.sum;
        let regex = /[0-9]{1}$/gm;
        let isNumber = regex.test(sum);

        if (!isNumber) {
            return false;
        }

        sum = math.eval(sum);
        sum = math.sqrt(sum);

        this.setState({
            display: sum,
            sum: sum,
            total: sum,
            init: true
        });
    }


    handleZero() {

        if (this.state.init === true) {
            return false;
        }

        let sum = this.state.sum;
        let regex = /^0{1}$/gm;
        let multipleZeros = regex.test(sum);

        if (multipleZeros) {
            return false;
        }

        this.setState({
            display: this.state.sum + '0',
            sum: this.state.sum + '0'
        }, this.handleEval);
    }


    handleDecimal() {
        let sum = this.state.sum + '.';
        let regex = /\.{2,}/gm
        let str = sum.match(/\D/gm).join('');
        if (regex.test(str)) {
            return false;
        }
        else {
            this.setState({
                display: sum,
                sum: sum
            })
        }

    }


    handleNumber(input) {
        let key = input.target.dataset.key;
        let value = input.target.dataset.value;
        let display = this.state.display;
        let sum = this.state.sum;

        if (this.state.init === true) {
            sum = this.state.newsum;
            display = this.state.newsum;
            this.setState({
                init: false
            })
        }

        this.setState({
            display: display + key,
            sum: sum + value
        }, this.handleEval);
        
    }


    handleOperation(input) {

        if (this.state.init === true && this.state.total !== '0') {
            this.setState({
                init: false
            })
        }

        let display = this.state.display;
        let sum = this.state.sum;
        let key = input.target.dataset.key;
        let value = input.target.dataset.value;

        let regex = /[/*\-+.%]$/m;
        let isOperator = regex.test(sum);

        if (isOperator) {
            sum = sum.slice(0, sum.length - 1);
            display = display.slice(0, display.length - 1);
        }

        this.setState({
            display: display + key,
            sum: sum + value
        })
    }

    
    handleEquals() {
        // Test last digit is a number
        let regex = RegExp(/[0-9]$/gm);
        if (regex.test(this.state.sum)) {
            let sum = math.eval(this.state.sum);
            this.setState({
                display: sum,
                sum: sum,
                total: sum,
                init: true
            })
        }
    }


    handleBack() {

        let display = this.state.display.toString();
        let sum = this.state.sum.toString();

        if (sum === '0' && this.state.init === true) {
            return false;
        }

        display = display.slice(0, display.length - 1);
        sum = sum.slice(0, sum.length - 1);

        if (sum.length === 0) {
            display = '0';
            sum = '0';
        }

        this.setState({
            display: display,
            sum: sum,
            total: sum
        }, this.handleEval)
    }


    handleClear() {
        this.setState({
            display: '0',
            sum: '0',
            total: '0',
            init: true
        })
    }


    handleEval() {
        let regex = RegExp(/[0-9]$/gm);
        if (regex.test(this.state.sum)) {
            let sum = math.eval(this.state.sum);
            this.setState({
                total: sum
            })
        }
    }



    // Render
    render() {
        return (
            <div id="calculator">
                <Screen display={this.state.display} total={this.state.total}/>
                <Bar back={this.handleBack}/>
                <Inputs handleInput={this.handleInput}/>
            </div>
        );
    }
}

/**
 * Render Calculator
 */
ReactDOM.render(<Calculator />, document.getElementById('root'));
