AOS.init();



// document.addEventListener("contextmenu", (event) => {
//   event.preventDefault();
// });


document.addEventListener("keydown", (event) => {
    // Disable F12
    if (event.key === "F12") {
        event.preventDefault();
    }
    // Disable Ctrl+Shift+I (Inspect Element)


});






// ------------------acordin code------------------//
function toggleAccordion(header) {
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(item => {
        if (item.contains(header)) {
            item.classList.toggle('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// -----------------------end----------------- // 


const invalid = document.querySelectorAll('.invalid');
const firstname = document.getElementById("firstname_user");
const secondname = document.getElementById("secondname_user");
const email_user = document.getElementById("email_user");
const password = document.getElementById("password_user");
const phone_user = document.getElementById("phone_user");
const birthdate_label = document.getElementById("birthdate_label");
const birthdate = document.getElementById("birthdate_user");
const gender = document.getElementById("gender_user");
const address = document.getElementById("address_user");
const city = document.getElementById("city_user");
const qpassword_user = document.getElementById("qpassword_user");
const qpassword = document.getElementById("qpassword");
const submitButton1 = document.getElementById("submitButton1")


console.log(invalid);


console.log("birthdate");
firstname.onmousedown = () => {
    birthdate.type = "text"
    qpassword.innerText = " "

    if (firstname) {

        firstname.addEventListener("keyup", function () {
            const name = firstname.value;
            const nameRegex = /^[A-Za-z\s'-]{2,}$/;

            if (!nameRegex.test(name)) {
                invalid[0].innerText = 'invalid name, must more than 2 characters'
                event.preventDefault(); // Prevent form submission if email is invalid
                submitButton1.type = "button"
            } else {
                invalid[0].innerText = ''
                submitButton1.type = "submit"
            }
        });
    }


}

secondname.onmousedown = () => {
    birthdate.type = "text"

    qpassword.innerText = " "
    if (secondname) {
        secondname.addEventListener("keyup", function (event) {
            const name = secondname.value;
            const nameRegex = /^[A-Za-z\s'-]{2,}$/;

            if (!nameRegex.test(name)) {
                invalid[1].innerText = 'invalid name, must more than 2 characters'
                event.preventDefault(); // Prevent form submission if email is invalid
               submitButton1.type = "button"
            } else {
                invalid[1].innerText = ''
                submitButton1.type = "submit"
            }
        });
    }
}


email_user.onmousedown = () => {
    birthdate.type = "text"
    qpassword.innerText = " "

    if (email_user) {
        email_user.addEventListener("keyup", function (event) {
            const email = email_user.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                invalid[2].innerText = 'invalid email'
                event.preventDefault(); // Prevent form submission if email is invalid
                email.value == '';
               submitButton1.type = "button"
            } else {
                invalid[2].innerText = ''
                submitButton1.type = "submit"
            }
        });
    }

}

password.onmousedown = () => {
    birthdate.type = "text"
    qpassword.innerText = " "
    const passwordError = document.getElementById('passwordError');


    password.addEventListener("keyup", function (event) {
        const passwordValue = password.value;

        // Validation criteria
        const lengthCheck = /.{8,}/; // At least 8 characters
        const uppercaseCheck = /[A-Z]/; // At least one uppercase letter
        const lowercaseCheck = /[a-z]/; // At least one lowercase letter
        const digitCheck = /\d/; // At least one digit
        const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

        let errorMessage = '';

        if (!lengthCheck.test(passwordValue)) {
            errorMessage += "Password must be at least 8 characters long.<br>";
            
            submitButton1.type = "button"
        }
        if (!uppercaseCheck.test(passwordValue)) {
            errorMessage += "Password must contain at least one uppercase letter.<br>";
            
            submitButton1.type = "button"
        }
        if (!lowercaseCheck.test(passwordValue)) {
            errorMessage += "Password must contain at least one lowercase letter.<br>";
            
            submitButton1.type = "button"
        }
        if (!digitCheck.test(passwordValue)) {
            errorMessage += "Password must contain at least one digit.<br>";
            
            submitButton1.type = "button"
        }
        if (!specialCharCheck.test(passwordValue)) {
            errorMessage += "Password must contain at least one special character.<br>";
            
            submitButton1.type = "button"
        }

        if (errorMessage) {
            passwordError.innerHTML = errorMessage;
        } else {
            passwordError.innerHTML = ''; // Clear the error message when valid
            submitButton1.type = "submit"
        }
    });


};

phone_user.onmousedown = () => {
    birthdate.type = "text"
    qpassword.innerText = " "
    if (phone_user) {
        phone_user.addEventListener("keyup", function (event) {
            const phone = phone_user.value;
            const phoneRegex = /^(\+?\d{1,3})?[-.\s]?(\(?\d{3}\)?)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

            if (!phoneRegex.test(phone)) {
                invalid[3].innerText = 'invalid phone'
                submitButton1.type = "button"
                event.preventDefault(); // Prevent form submission if email is invalid
            } else {
                invalid[3].innerText = ''
                submitButton1.type = "submit"
            }
        });
    }
}

qpassword_user.onmousedown = () => {
    birthdate.type = "text"
    if (qpassword_user) {
        qpassword.innerText = "- What is your lovely food ?"
    }


}

birthdate.onmousedown = () => {
    qpassword.innerText = " "
}



birthdate.oninput = () => {
    birthdate.type = "date"

    birthdate.addEventListener("keyup", function (event) {
        const userbirthdate = new Date(birthdate.value);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - userbirthdate.getFullYear();
        const month = currentDate.getMonth() - userbirthdate.getMonth();

        if (month < 0 || (month === 0 && currentDate.getDate() < userbirthdate.getDate())) {
            age--; // Adjust age if the birthday hasn't occurred yet this year
        }

        // Check if the user is 16 or older
        if (isNaN(userbirthdate.getTime())) {
            invalid[5].innerText = "Please enter a valid birthdate.";
            event.preventDefault();
            submitButton1.type = "button"
        } else if (age < 16) {
            invalid[5].innerText = "You must be at least 16 years old.";
            event.preventDefault();
            submitButton1.type = "button"
        } else {
            invalid[5].innerText = ""; // Clear the error if the date is valid
            submitButton1.type = "submit"
        }
    });
}




gender.onmousedown = () => {
    birthdate.type = "text"
    qpassword.innerText = " "
    gender.addEventListener("keyup", function (event) {
        const genderValue = gender.value.trim().toLowerCase();

        if (genderValue !== "male" && genderValue !== "female") {
            event.preventDefault();
            invalid[6].innerText = "Please enter 'male' or 'female'.";
            submitButton1.type = "button"
        } else {
            invalid[6].innerText = ""; // Clear the error if input is valid
            submitButton1.type = "submit"
        }
    });
};



address.onmousedown = () => {
    birthdate.type = "text"
    qpassword.innerText = " "

    address.addEventListener('keyup', function (event) {
        const addressvalid = address.value.trim();

        // Validation criteria
        const minLength = 5; // Minimum address length
        const addressRegex = /^[a-zA-Z0-9\s,.'-]{5,}$/; // Allows letters, numbers, spaces, and common punctuation

        if (!addressvalid) {
            invalid[7].innerText = "Address cannot be empty.";
            event.preventDefault(); // Prevent form submission
            submitButton1.type = "button"
        } else if (addressvalid.length < minLength) {
            invalid[7].innerText = `Address must be at least ${minLength} characters long.`;
            event.preventDefault();
            submitButton1.type = "button"
        } else if (!addressRegex.test(addressvalid)) {
            invalid[7].innerText = "Address contains invalid characters.";
            event.preventDefault();
            submitButton1.type = "button"
        } else {
            invalid[7].innerText = ""; // Clear the error if the address is valid
            submitButton1.type = "submit"
        }
    });

}


submitButton1.onmousedown =()=>{
    birthdate.type = "text"
    qpassword.innerText = " "
}



document.getElementById("togglePassword").addEventListener("click", function () {

    const toggleIcon = document.getElementById("toggleIcon");

    if (password.type === "password") {
        password.type = "text";
        toggleIcon.src = "/images/hide.png"; // Icon for "hide password"
        toggleIcon.alt = "Hide Password";
    } else {
        password.type = "password";
        toggleIcon.src = "/images/show.png"; // Icon for "show password"
        toggleIcon.alt = "Show Password";
    }
});

