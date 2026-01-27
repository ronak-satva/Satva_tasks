$(document).ready(function(){

    const quizData = [
        {
            question: "What is the capital of India?",
            type: "radio",
            options: ["Mumbai", "Delhi", "Chennai"],
            answer: "Delhi"
        },
        {
            question: "Which language is used for jQuery?",
            type: "radio",
            options: ["Python", "JavaScript", "PHP"],
            answer: "JavaScript"
        },
        {
            question: "Who developed JavaScript?",
            type: "text",
            answer: "Brendan Eich"
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];

    // Load question
    function loadQuestion() {
        $("#errorMsg, .feedback").text("");
        $("#options").hide().fadeIn(800);

        let q = quizData[currentQuestion];
        $("#questionNumber").text(`Question ${currentQuestion + 1} of ${quizData.length}`);
        $("#questionText").text(q.question);

        $("#options").html("");

        if (q.type === "radio") {
            q.options.forEach(option => {
                $("#options").append(`
                    <div class="form-check text-start">
                        <input type="radio" name="answer" value="${option}" class="form-check-input">
                        <label class="form-check-label">${option}</label>
                    </div>
                `);
            });
        } 

        if (q.type === "text") {
            $("#options").html(`
                <input type="text" id="textAnswer" class="form-control" placeholder="Enter your answer">
            `);
        
            allowOnlyLetters();
        }
    }

    function allowOnlyLetters() {
        $("#textAnswer").on("input", function () {
            let value = $(this).val();
            let filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
            $(this).val(filteredValue);
        });
    }
    
    // Validate answer
    function validateAnswer() {
        let q = quizData[currentQuestion];

        if (q.type === "radio") {
            if (!$("input[name='answer']:checked").length) {
                showError("Please select an option");
                return false;
            }
        } else {
            let answer = $("#textAnswer").val().trim();
        
            if (!answer) {
                showError("Answer cannot be empty");
                return false;
            }
        
            if (!/^[a-zA-Z\s]+$/.test(answer)) {
                showError("Only letters are allowed");
                return false;
            }
        }
        return true;
    }


     // Check correctness
     function checkAnswer() {
        let q = quizData[currentQuestion];
        let userAnswer;
    
        if (q.type === "radio") {
            userAnswer = $("input[name='answer']:checked").val();
        } else {
            userAnswer = $("#textAnswer").val().trim();
        }
    
        userAnswers.push({
            question: q.question,
            userAnswer: userAnswer,
            correctAnswer: q.answer,
            isCorrect: userAnswer.toLowerCase() === q.answer.toLowerCase()
        });
    
        if (userAnswer.toLowerCase() === q.answer.toLowerCase()) {
            score++;
        }
    }
    

    // // Show error
    // function showError(msg) {
    //     $("#errorMsg").hide().text(msg).fadeIn(400);
    // }

    //  // Show feedback
    //  function showFeedback(msg, className) {
    //     $(".feedback").hide().removeClass("correct incorrect")
    //         .addClass(className)
    //         .text(msg)
    //         .fadeIn(500);
    // }

    // Next question
    function nextQuestion() {
        currentQuestion++;

        if (currentQuestion < quizData.length) {
            setTimeout(loadQuestion, 800);
        } else {
            showFinalScore();
        }
    }

     // Final score
     function showFinalScore() {
        $(".quiz-box > *").hide();
    
        $("#finalScore").show();
        $("#restartBtn").show();
    
        $("#scoreText").text(`${score} / ${quizData.length}`);
    
        $("#correctList").html("");
        $("#wrongList").html("");
    
        userAnswers.forEach(item => {
            if (item.isCorrect) {
                $("#correctList").append(`
                    <p>✔ ${item.question} <br>
                    <strong>Answer:</strong> ${item.correctAnswer}</p>
                `);
            } else {
                $("#wrongList").append(`
                    <p>❌ ${item.question} <br>
                    <strong>Your Answer:</strong> ${item.userAnswer} <br>
                    <strong>Correct Answer:</strong> ${item.correctAnswer}</p>
                `);
            }
        });
    }
    

    // Restart quiz
    function resetQuiz() {
        currentQuestion = 0;
        score = 0;
        userAnswers = [];
    
        $(".quiz-box > *").show();
        $("#finalScore, #restartBtn").hide();
    
        loadQuestion();
    }
    

     // Events
     $("#nextBtn").click(function () {
        if (!validateAnswer()) return;
        checkAnswer();
        nextQuestion();
    });

    $("#restartBtn").click(resetQuiz);

    // Start quiz
    loadQuestion();
});