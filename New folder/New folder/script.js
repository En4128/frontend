document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulate authentication
    if (username.startsWith('P')) {
        document.getElementById('professorSection').style.display = 'block';
        document.getElementById('studentSection').style.display = 'none';
    } else if (username.startsWith('A')) {
        document.getElementById('professorSection').style.display = 'none';
        document.getElementById('studentSection').style.display = 'block';
    }
});

document.getElementById('availabilityForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const slot = document.getElementById('availableSlots').value;
    // Here you would send the slot to the backend to update professor's availability
    alert('Availability set for: ' + slot);
});

document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const professor = document.getElementById('professor').value;
    const slot = document.getElementById('slot').value;
    // Here you would send the booking details to the backend
    alert('Appointment booked with ' + professor + ' at ' + slot);
});