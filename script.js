// Mock data storage (in a real application, this would be a backend database)
let appointments = [];
const users = {
    students: [
        { username: 'student1', password: 'pass123', name: 'John Smith' },
        { username: 'student2', password: 'pass123', name: 'Emma Wilson' },
        { username: 'Elango', password: 'elango', name: 'Elangovan' }
    ],
    professors: [
        { username: 'professor1', password: 'pass123', name: 'Dr. Sarah Johnson' },
        { username: 'professor2', password: 'pass123', name: 'Dr. Robert Davis' },
        { username: 'professor3', password: 'pass123', name: 'Dr. Emily White' }
    ]
};

let currentUser = null;
let userType = null;

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.5s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Authentication functions
function showLogin(type) {
    userType = type;
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('loginTitle').textContent = 
        `${type.charAt(0).toUpperCase() + type.slice(1)} Login`;
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const userList = userType === 'student' ? users.students : users.professors;
    const user = userList.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = username;
        document.getElementById('authContainer').style.display = 'none';
        if (userType === 'student') {
            document.getElementById('studentDashboard').style.display = 'block';
            loadStudentAppointments();
            showNotification(`Welcome back, ${user.name}!`, 'success');
        } else {
            document.getElementById('professorDashboard').style.display = 'block';
            loadProfessorAppointments();
            showNotification(`Welcome back, ${user.name}!`, 'success');
        }
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

function logout() {
    const userList = userType === 'student' ? users.students : users.professors;
    const user = userList.find(u => u.username === currentUser);
    showNotification(`Goodbye, ${user.name}!`, 'info');
    
    currentUser = null;
    userType = null;
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('studentDashboard').style.display = 'none';
    document.getElementById('professorDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Appointment functions
function bookAppointment() {
    const professor = document.getElementById('professorSelect').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const reason = document.getElementById('appointmentReason').value;

    if (!professor || !date || !time || !reason) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const appointment = {
        id: Date.now(),
        student: currentUser,
        professor,
        date,
        time,
        reason,
        status: 'pending'
    };

    appointments.push(appointment);
    loadStudentAppointments();
    clearAppointmentForm();
    showNotification('Appointment booked successfully!', 'success');
}

function clearAppointmentForm() {
    document.getElementById('professorSelect').value = '';
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentTime').value = '';
    document.getElementById('appointmentReason').value = '';
}

function loadStudentAppointments() {
    const studentAppointments = appointments.filter(app => app.student === currentUser);
    const container = document.getElementById('studentAppointmentsList');
    container.innerHTML = studentAppointments.map(app => `
        <div class="appointment-card ${app.status}">
            <p><strong>Professor:</strong> ${app.professor}</p>
            <p><strong>Date:</strong> ${app.date}</p>
            <p><strong>Time:</strong> ${app.time}</p>
            <p><strong>Reason:</strong> ${app.reason}</p>
            <p><strong>Status:</strong> ${app.status}</p>
        </div>
    `).join('');
}

function loadProfessorAppointments() {
    const pendingContainer = document.getElementById('pendingAppointmentsList');
    const approvedContainer = document.getElementById('approvedAppointmentsList');

    const pendingAppointments = appointments.filter(app => app.status === 'pending');
    const approvedAppointments = appointments.filter(app => app.status === 'approved');

    pendingContainer.innerHTML = pendingAppointments.map(app => {
        const student = users.students.find(u => u.username === app.student);
        return `
            <div class="appointment-card pending">
                <p><strong>Student:</strong> ${student ? student.name : app.student}</p>
                <p><strong>Date:</strong> ${app.date}</p>
                <p><strong>Time:</strong> ${app.time}</p>
                <p><strong>Reason:</strong> ${app.reason}</p>
                <div class="action-buttons">
                    <button class="approve-btn" onclick="updateAppointmentStatus(${app.id}, 'approved')">
                        Approve
                    </button>
                    <button class="reject-btn" onclick="updateAppointmentStatus(${app.id}, 'rejected')">
                        Reject
                    </button>
                </div>
            </div>
        `;
    }).join('');

    approvedContainer.innerHTML = approvedAppointments.map(app => {
        const student = users.students.find(u => u.username === app.student);
        return `
            <div class="appointment-card approved">
                <p><strong>Student:</strong> ${student ? student.name : app.student}</p>
                <p><strong>Date:</strong> ${app.date}</p>
                <p><strong>Time:</strong> ${app.time}</p>
                <p><strong>Reason:</strong> ${app.reason}</p>
            </div>
        `;
    }).join('');
}

function updateAppointmentStatus(appointmentId, status) {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
        appointment.status = status;
        loadProfessorAppointments();
        const student = users.students.find(u => u.username === appointment.student);
        showNotification(
            `Appointment ${status} for ${student ? student.name : appointment.student}`,
            status === 'approved' ? 'success' : 'error'
        );
    }
}