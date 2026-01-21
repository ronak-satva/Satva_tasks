function addFirstTwoNumbers(firstValue, secondValue) {
    return firstValue + secondValue;
  }

  function addMultipleNumbers(numberString) {
    return numberString
      .split(/[\s,]+/)
      .map(value => parseFloat(value) || 0)
      .reduce((sum, value) => sum + value, 0);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formElement = event.target;

    if (!formElement.checkValidity()) {
      formElement.classList.add("was-validated");
      return;
    }

    const firstNumber = parseFloat(document.getElementById("textBoxOne").value);
    const secondNumber = parseFloat(document.getElementById("textBoxTwo").value);
    const thirdInput = document.getElementById("textBoxThree").value;

    const firstTwoSum = addFirstTwoNumbers(firstNumber, secondNumber);
    const thirdSum = addMultipleNumbers(thirdInput);
    const totalSum = firstTwoSum + thirdSum;

    document.getElementById("textBoxFour").value =
      `${firstTwoSum} | ${thirdSum} | ${totalSum}`;
  }