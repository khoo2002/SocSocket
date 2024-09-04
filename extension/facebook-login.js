
async function waitForElement(selector, timeout = 60000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const interval = 500;

        function check() {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            } else if (Date.now() - startTime > timeout) {
                reject(new Error(`Element with selector "${selector}" not found within timeout`));
            } else {
                setTimeout(check, interval);
            }
        }

        check();
    });
}

async function loginFacebook() {
    try {
        const emailElement = await waitForElement('#email');
        const passwordElement = await waitForElement('#pass');

        if (emailElement && passwordElement) {
            console.log('Email and password fields are available');
            // Here you can perform actions like filling in credentials
            emailElement.value = 'your-email@example.com';
            passwordElement.value = 'your-password';
            document.querySelector('button[name="login"]').click();
        } else {
            console.error('Email or password fields are not available');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Call the function to execute the logic
loginFacebook();
