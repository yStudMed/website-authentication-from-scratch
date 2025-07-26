let confirmedDelete = false;

function confirmDelete() {
    // Show modal and prevent immediate form submission
    document.getElementById("customConfirm").classList.remove("hidden");
    return false;
}

function handleConfirm(choice) {
    document.getElementById("customConfirm").classList.add("hidden");
    if (choice) {
        confirmedDelete = true;
        document.getElementById("deleteForm").submit();
    }
}
