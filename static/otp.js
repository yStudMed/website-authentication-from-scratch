const inputs = document.querySelectorAll(".otp-inputs input");

inputs.forEach((input, index, array) => {
    input.addEventListener("input", () => {
        if (input === array[array.length - 1] && input.value.length > 0) {
            input.blur();
        }

        const value = input.value;
        if (value && index < array.length - 1) {
            array[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
            array[index - 1].focus();
        }
    });

    input.addEventListener("paste", (e) => {
        const pasteData = e.clipboardData.getData("text").trim();

        if (!/^\d+$/.test(pasteData)) return;

        if (pasteData.length === array.length) {
            e.preventDefault();
            array.forEach((inp, i) => {
                inp.value = pasteData[i];
            });
            array[array.length - 1].focus();
        }
    });
});
