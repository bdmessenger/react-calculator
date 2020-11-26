import React, {useState} from 'react'


const inputs = [
    'AC', '/', 'x', 
    7, 8, 9, '‑', 4, 5, 6, 
    '+', 1, 2, 3, '=', 0, '.'
]

const   isOperator = /[x/+‑]/,
        endsWithOperator = /[x/+‑]$/,
        endsWithNegativeSign = /[x/+]‑$/;

export default function Calculator() {
    const [currentValue, setCurrentValue] = useState("0");
    const [previousValue, setPreviousValue] = useState("0");
    const [calculation, setCalculation] = useState("");
    const [evaluated, setEvaluated] = useState(false);
    const [lastInputClick, setLastInputClick] = useState("");

    const handleNumber = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(!currentValue.includes("Limit")) {
            const value: string = e.currentTarget.value;
            setEvaluated(false);
            if(currentValue.length > 21) return maxDigitWarning();

            if(evaluated) {
                setCurrentValue(value);
                setCalculation(value !== "0" ? value: "");
            } else {
                setCurrentValue(
                    (currentValue === "0" || isOperator.test(currentValue)) ?
                    value :
                    currentValue + value
                );
                setCalculation(
                    (currentValue === "0" && value === "0") ?
                    (calculation === "" ? value : calculation) :
                    (/([^.0-9]0|^0)$/.test(calculation) ?
                    calculation.slice(0, -1) + value :
                    calculation + value)
                );
            }
            setLastInputClick(value);
        }
    }

    const handleOperator = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(!currentValue.includes("Limit") && (
            lastInputClick.length > 0 || e.currentTarget.value === '-'
        )) {
            const value: string = e.currentTarget.value;
            setCurrentValue(value);
            setEvaluated(false);

            if(evaluated) {
                setCalculation(previousValue + value);
            } else if (!endsWithOperator.test(calculation)) {
                console.log('hello there');
                setPreviousValue(calculation);
                setCalculation(state => state + value);
            } else if (!endsWithNegativeSign.test(calculation)) {
                setCalculation(state => (endsWithNegativeSign.test(state + value) ?
                    state :
                    previousValue) + value
                );
            } else if (value !== "-") {
                setCalculation(previousValue + value);
            }
        }
    }

    const handleDecimal = () => {
        if(evaluated) {
            setCurrentValue("0.");
            setCalculation("0.");
            setEvaluated(false);
        } else if (
            !currentValue.includes(".") &&
            !currentValue.includes("Limit"))
        {
            setEvaluated(false);
            if(currentValue.length > 21) {
                maxDigitWarning();
            } else if(
                endsWithOperator.test(calculation) ||
                (currentValue === "0" && calculation === ""))
            {
                setCurrentValue("0.");
                setCalculation(state => state + "0.");
            } else {
                const match = calculation.match(/(-?\d+\.?\d*)$/);
                setCurrentValue((match ? match[0] : '') + ".");
                setCalculation(state => state + ".");
            }
        }
    }

    const handleEvaluate = () => {
        if(!currentValue.includes("Limit")) {
            let expression: string = calculation;

            while(endsWithOperator.test(expression)) {
                expression = expression.slice(0, -1);
            }

            expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
            let answer: number = Math.round(1000000000000 * eval(expression)) / 1000000000000;

            setCurrentValue(answer.toString());
            setCalculation(expression.replace(/\*/g, "⋅").replace(/-/g, "‑") + "=" + answer);
            setPreviousValue(answer.toString());
            setEvaluated(true);
        }
    }

    const maxDigitWarning = () => {
        const prevValue: string = currentValue
        setCurrentValue('Digit Limit Met');
        setTimeout(() => setCurrentValue(prevValue), 1000);
    }

    const reset = () => {
        setCurrentValue("0");
        setPreviousValue("0");
        setCalculation("");
        setEvaluated(false);
        setLastInputClick("");
    }

    return (
        <div className="calculator">
            <div className="calculation-display">{calculation.replace(/x/g, '.')}</div>
            <div className="output-display">{currentValue}</div>
            <div className="inputs-container">
            {
                inputs.map((input, index) => {
                    let style = {}
                    if(typeof input === 'number') {
                        if(input === 0) style = {gridColumn: 'auto / span 2'}
                        return (
                            <button 
                                key={`input${index + 1}`} 
                                id={`input${index + 1}`} 
                                value={input}
                                onClick={handleNumber}
                                style={style}
                            >
                                {input}
                            </button>
                        )
                    }

                    let onClickMethod;

                    switch(input) {
                        case 'AC':
                            onClickMethod = reset;
                            style = {
                                gridColumn: 'auto / span 2',
                                background: '#fc5185'
                            }
                            break;
                        case '/':
                        case 'x':
                        case '‑':
                        case '+':
                            onClickMethod = handleOperator;
                            style = { background: '#6898ce'}
                            break;
                        case '=':
                            onClickMethod = handleEvaluate;
                            style = {
                                gridRow: 'auto / span 2',
                                background: '#3fc1c9'
                            }
                            break;
                        case '.':
                            onClickMethod = handleDecimal;
                            break;
                        default:
                            break;
                    }

                    return (
                        <button
                            key={`input${index + 1}`} 
                            id={`input${index + 1}`}
                            value={input}
                            style={style}
                            onClick={onClickMethod}
                        >
                            {input}
                        </button>
                    )
                })
            }
            </div>
        </div>
    )
}