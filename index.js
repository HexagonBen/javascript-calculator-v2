function App() {
    const [numberString, setNumberString] = React.useState("")
    //this decimal state is referenced by the enterNumber function to prevent the user from entering multiple decimals into a single number
    const [decimal, setDecimal] = React.useState(false)
    const [result, setResult] = React.useState("")
    const [digitLimit, setDigitLimit] = React.useState(false)
  
    React.useEffect(() => {setNumberString(result)}, [result])
  
    function clear() {
        setNumberString("")
        setDecimal(false)
        setResult("")
    }
  
    //this function manages the number before the operator, or the number after the operator if the user has already input an operator.
    //first check for 16 digit limit. If reached, ignore input and display 3-second notification.
    function enterNumber(number) {
        if (numberString.length > 15) {
            setDigitLimit(true);
            return setTimeout(clearLimitMessage, 3000)
        }
        //ignore input if it's a decimal and a decimal has already been entered
        if (number == "." && decimal) {return}
        if (number == ".") {setDecimal(true)}
        //prevent multiple zeroes at beginning of numbers
        if ((number == "0" && /^0$/.test(numberString)) | (number == "0" && /[\*\/\+\-]0$/.test(numberString))) {return}
        setNumberString(prev => prev + number)
    }
  
    //this is called by enterNumber after 3 seconds of displaying the limit notification to clear the message.
    function clearLimitMessage() {setDigitLimit(false)}
  
    function enterOperator(selectedOperator) {
        //ignore operator input if numbers haven't been entered yet (except "-")
        if (selectedOperator != "-" && !/\d+/.test(numberString)) {return}
        //ignore "-" if it has already been input and it's the only character in the string
        if (selectedOperator == "-" && /^\-/.test(numberString)) {return}
        //Prevent stacking of multiple operators but allow user to change operator if desired ("-" requires unique logic to allow for negative numbers)
        let last = numberString[numberString.length-1]
        //if there's already two operators in a row (only possible if second one is a "-"), replace both with the new entry.
        if (/[\/\*\+\-]{2}$/.test(numberString)) {
          return setNumberString(prev => prev.slice(0, prev.length-2)+selectedOperator)
        }
        if ((selectedOperator != "-" && (last == "." | last == "/" | last == "*" | last == "+" | last == "-")) | (selectedOperator == "-" && last == ".")) {
            let template = numberString.split("")
            template[template.length-1] = selectedOperator;
            template = template.join("")
            setNumberString(template)
        } else {
            setNumberString(prev => prev + selectedOperator)
            setDecimal(false)
        }
        
    }
  
    //this large function contains 4 subfunctions (one for each type of operation) & handles calculation of the answer. 
    function calculate() {
  
    //multiplication resolver
    function multResolver(string) {
    //this regex is necessarily complex because it must allow for additional "-"s at the beginning of numbers, representing negative numbers.
    let hunter = /(^\-)?[^\/\+\*\-]+\*\-?[^\/\+\*\-]+|[\/\*\+\-]-[^\/\+\*\-]+\*\-?[^\/\+\*\-]+/
    if (hunter.test(string)) {
    //operatorInstance will extract a match. We will then replace it with a single number to resolve it.
    let operatorInstance = string.match(hunter)[0]
    console.log(operatorInstance)
    //isolate numbers on either side of operator to operate on them and then return result as a single number.
    let numberHunter = /\-?\.?\d+\.?\d*/g
    let twoNumbers = operatorInstance.match(numberHunter)
    console.log(twoNumbers)
    let result = parseFloat(twoNumbers[0])*parseFloat(twoNumbers[1])
    result = Math.round(result*1000000000000)/1000000000000
    console.log(result)
    //because the hunter regex looks for "-" following other operators to allow for negative numbers, it will inadvertently extract the preceding operator as well in this situation. To prevent "eating" the preceding operator when we replace, we must append the operator back on to the front of the result before replacing the operatorInstance with the result in the string.
    if (/[\/\*\+\-]-[^\/\+\*\-]+\*\-?[^\/\+\*\-]+/.test(operatorInstance)) {
        result = `${operatorInstance[0]}${result}`
    }
    console.log(result)
    string = string.replace(hunter, result)
    console.log(string)
    }
    return(string)
    }
  
    //division resolver
    function divResolver(string) {
    //this regex is necessarily complex because it must allow for additional "-"s at the beginning of numbers, representing negative numbers.
    let hunter = /(^\-)?[^\/\+\*\-]+\/\-?[^\/\+\*\-]+|[\/\*\+\-]-[^\/\+\*\-]+\/\-?[^\/\+\*\-]+/
    if (hunter.test(string)) {
    //operatorInstance will extract a match. We will then replace it with a single number to resolve it.
    let operatorInstance = string.match(hunter)[0]
    console.log(operatorInstance)
    //isolate numbers on either side of operator to operate on them and then return result as a single number.
    let numberHunter = /\-?\.?\d+\.?\d*/g
    let twoNumbers = operatorInstance.match(numberHunter)
    console.log(twoNumbers)
    let result = parseFloat(twoNumbers[0])/parseFloat(twoNumbers[1])
    result = Math.round(result*1000000000000)/1000000000000
    console.log(result)
    //because the hunter regex looks for "-" following other operators to allow for negative numbers, it will inadvertently extract the preceding operator as well in this situation. To prevent "eating" the preceding operator when we replace, we must append the operator back on to the front of the result before replacing the operatorInstance with the result in the string.
    if (/[\/\*\+\-]-[^\/\+\*\-]+\/\-?[^\/\+\*\-]+/.test(operatorInstance)) {
        result = `${operatorInstance[0]}${result}`
    }
    console.log(result)
    string = string.replace(hunter, result)
    console.log(string)
    }
    return(string)
    }
  
    //addition resolver
    function addResolver(string) {
    //this regex is necessarily complex because it must allow for additional "-"s at the beginning of numbers, representing negative numbers.
    let hunter = /(^\-)?[^\/\+\*\-]+\+\-?[^\/\+\*\-]+|[\/\*\+\-]-[^\/\+\*\-]+\+\-?[^\/\+\*\-]+/
    if (hunter.test(string)) {
    //operatorInstance will extract a match. We will then replace it with a single number to resolve it.
    let operatorInstance = string.match(hunter)[0]
    console.log(operatorInstance)
    //isolate numbers on either side of operator to operate on them and then return result as a single number.
    let numberHunter = /\-?\.?\d+\.?\d*/g
    let twoNumbers = operatorInstance.match(numberHunter)
    console.log(twoNumbers)
    let result = parseFloat(twoNumbers[0])+parseFloat(twoNumbers[1])
    result = Math.round(result*1000000000000)/1000000000000
    console.log(result)
    //because the hunter regex looks for "-" following other operators to allow for negative numbers, it will inadvertently extract the preceding operator as well in this situation. To prevent "eating" the preceding operator when we replace, we must append the operator back on to the front of the result before replacing the operatorInstance with the result in the string.
    if (/[\/\*\+\-]-[^\/\+\*\-]+\+\-?[^\/\+\*\-]+/.test(operatorInstance)) {
        result = `${operatorInstance[0]}${result}`
    }
    console.log(result)
    string = string.replace(hunter, result)
    console.log(string)
    }
    return(string)
    }
  
    //subtraction resolver
    function subResolver(string) {
    //this regex is necessarily complex because it must allow for additional "-"s at the beginning of numbers, representing negative numbers.
    let hunter = /(^\-)?[^\/\+\*\-]+\-\-?[^\/\+\*\-]+|[\/\*\+\-]-[^\/\+\*\-]+\-\-?[^\/\+\*\-]+/
    if (hunter.test(string)) {
    //operatorInstance will extract a match. We will then replace it with a single number to resolve it.
    let operatorInstance = string.match(hunter)[0]
    console.log(operatorInstance)
    //isolate numbers on either side of operator to operate on them and then return result as a single number.
    let numberHunter = /\-?\.?\d+\.?\d*/g
    let twoNumbers = operatorInstance.match(numberHunter)
    //the numberHunter regex must allow for "-" before numbers, and so will inadvertently collect the "-" operator if the second number is not negative. We correct for this by adding instead of subtracting, unless the second number is negative, in which case everything works normally.
    console.log(twoNumbers)
    let result
    if (/--/.test(operatorInstance)) {
      result = parseFloat(twoNumbers[0])-parseFloat(twoNumbers[1])
    } else {
      result = parseFloat(twoNumbers[0])+parseFloat(twoNumbers[1])
    }
    result = Math.round(result*1000000000000)/1000000000000
    console.log(result)
    //because the hunter regex looks for "-" following other operators to allow for negative numbers, it will inadvertently extract the preceding operator as well in this situation. To prevent "eating" the preceding operator when we replace, we must append the operator back on to the front of the result before replacing the operatorInstance with the result in the string.
    if (/[\/\*\+\-]-[^\/\+\*\-]+\-\-?[^\/\+\*\-]+/.test(operatorInstance)) {
        result = `${operatorInstance[0]}${result}`
    }
    console.log(result)
    string = string.replace(hunter, result)
    console.log(string)
    }
    return(string)
    }
  
    //the following code scans the number string for operators and then executes multiplication & division before addition & subtraction.
    let stringCopy = ""+numberString;
    let conductor = stringCopy.match(/[\*\/\+]|[^\*\/\+\-]\-/g)
    console.log(`Here's the input: ${numberString}`)
    console.log(`Here's the conductor: ${conductor}`)
    for (let i = 0; i < conductor.length; i++) {
    if (conductor[i] == "*") {stringCopy = multResolver(stringCopy)}
    if (conductor[i] == "/") {stringCopy = divResolver(stringCopy)}
    }
    
    for (let i = 0; i < conductor.length; i++) {
      if (conductor[i] == "+") {stringCopy = addResolver(stringCopy)}
      if (/\-/.test(conductor[i])) {stringCopy = subResolver(stringCopy)}
    }
    let answer = parseFloat(stringCopy).toFixed(6)
    answer = answer.toString()
    answer = answer.replace(/\.?0*$/, "")
    setResult(answer)
    }
    //end calculation function
  
    //original code used simple arrays here, but freeCodeCamp required unique ids, which I provided as additional data in the reference arrays.
    //let numberValueArray = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."]
    let numberValueArray = [{value: "7", id: "seven"},{value: "8", id: "eight"},{value: "9", id: "nine"},{value: "4", id: "four"},{value: "5", id: "five"},{value: "6", id: "six"},{value: "1", id: "one"},{value: "2", id: "two"},{value: "3", id: "three"},{value: "0", id: "zero"},{value: ".", id: "decimal"}]
    //let operatorsArray = ["/", "*", "-", "+"]
    let operatorsArray = [{value: "/", id: "divide"},{value: "*", id: "multiply"},{value: "-", id: "subtract"},{value: "+", id: "add"}]
  
    return (
        <main>
        <div className="calculator">
            <div className="display" id="display">
                {digitLimit && <div>digit limit reached</div>}
                {numberString == "" && <div>0</div>}
                {numberString != result && !digitLimit && <div>{numberString}</div>}
                {result && <div>{result}</div>}
            </div>
            <div className="AC" onClick={clear} id="clear">AC</div>
            {operatorsArray.map(operator => <Operator operator={operator.value} enterOperator={() => enterOperator(operator.value)} key={operator.value} id={operator.id}/>)}
            <div className="equals" onClick={calculate} id="equals">=</div>
            <div className="numbersGroup">
                {numberValueArray.map(number => <NumberButton numberValue={number.value} enterNumber={() => enterNumber(number.value)} key={number.value} id={number.id}/>)}
            </div>
        </div>
        </main>
    );
  }
  
  //begin subcomponents
  function NumberButton(props) {
    return (
        <div className="individualNumbers" id={props.id} onClick={props.enterNumber}>{props.numberValue}</div>
    )
  }
  
  function Operator(props) {
    return (
        //here we conditionally render the font awesome division symbol instead of "/" and "X" instead of "*"
        <div 
            className="individualOperators"
            id={props.id}
            onClick={props.enterOperator}
            >
            {props.operator != "/" && props.operator != "*" && props.operator}
            {props.operator == "/" && <i className="fa-solid fa-divide"></i>}
            {props.operator == "*" && "X"}
        </div>
    )
  }
  
  
  ReactDOM.render(<App/>, document.getElementById("app"));