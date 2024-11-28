document.addEventListener('DOMContentLoaded', () => {
  const sessions = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const availableDates = getAvailableDates();
  const dateDropdown = document.getElementById('date-dropdown');
  
  availableDates.forEach(date => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    dateDropdown.appendChild(option);
  });

  dateDropdown.addEventListener('change', handleDateChange);
  
  const sessionDropdown = document.getElementById('session-dropdown');
  sessions.forEach(session => {
    const option = document.createElement('option');
    option.value = session;
    option.textContent = session;
    sessionDropdown.appendChild(option);
  });

  sessionDropdown.addEventListener('change', handleSessionChange);

  renderSeats();

  const bookButton = document.getElementById('book-button');
  bookButton.addEventListener('click', handleBooking);
});

function getAvailableDates() {
  const today = new Date();
  const availableDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formattedDate = date.toISOString().split('T')[0]; 
    availableDates.push(formattedDate);
  }
  return availableDates;
}

function handleDateChange(event) {
  const selectedDate = event.target.value;
  const sessionDropdown = document.getElementById('session-dropdown');
  sessionDropdown.selectedIndex = 0;
  
  renderSeats(selectedDate); 
}

function handleSessionChange() {
  const sessionDropdown = document.getElementById('session-dropdown');
  const selectedSession = sessionDropdown.value;
  renderSeats();
  
  const today = new Date();
  const selectedDate = document.getElementById('date-dropdown').value;
  const selectedSessionTime = selectedSession.split(':')[0]; 
  
  const sessionDate = new Date(selectedDate);
  sessionDate.setHours(selectedSessionTime, 0, 0, 0);
  
  if (sessionDate < today) {
    document.querySelectorAll('.seat').forEach(seatDiv => {
      seatDiv.classList.add('archived');
      seatDiv.onclick = null;
    });
  }
}


function renderSeats(selectedDate) {
  const seatsContainer = document.getElementById('seats-container');
  seatsContainer.innerHTML = '';
  
  const seats = ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5'];

  seats.forEach(seat => {
    const seatDiv = document.createElement('div');
    seatDiv.classList.add('seat');
    seatDiv.textContent = seat;

    if (isSeatBooked(seat, selectedDate)) {
      seatDiv.classList.add('booked');
      seatDiv.onclick = () => alert('Место уже забронировано');
    } else {
      seatDiv.onclick = () => toggleSeatSelection(seat, seatDiv);
    }

    seatsContainer.appendChild(seatDiv);
  });
}

function isSeatBooked(seat, selectedDate) {
  const sessionDropdown = document.getElementById('session-dropdown');
  const selectedSession = sessionDropdown.value;
  const storedBookings = JSON.parse(localStorage.getItem(`${selectedDate}_${selectedSession}`)) || [];
  
  return storedBookings.includes(seat);
}


function toggleSeatSelection(seat, seatDiv) {
  if (seatDiv.classList.contains('booked')) {
    alert('Это место уже забронировано.');
    return;
  }

  seatDiv.classList.toggle('selected');
}


function handleBooking() {
    const selectedSeats = [];
    const sessionDropdown = document.getElementById('session-dropdown');
    const selectedSession = sessionDropdown.value;
    const seatsContainer = document.getElementById('seats-container');
    const selectedSeatDivs = seatsContainer.querySelectorAll('.seat.selected');
  
    if (selectedSeatDivs.length === 0) {
      alert('Выберите хотя бы одно место для бронирования.');
      return;
    }
  
    const today = new Date();
    const selectedDate = document.getElementById('date-dropdown').value;
    const selectedSessionTime = selectedSession.split(':')[0]; 
    const sessionDate = new Date(selectedDate);
    sessionDate.setHours(selectedSessionTime, 0, 0, 0);
  
    if (sessionDate < today) {
      alert('Вы не можете забронировать места на прошедший сеанс.');
      return;
    }
  
    const storedBookings = JSON.parse(localStorage.getItem(`${selectedDate}_${selectedSession}`)) || [];
  
    selectedSeatDivs.forEach(seatDiv => {
      const seat = seatDiv.textContent;
      if (!storedBookings.includes(seat)) {
        storedBookings.push(seat);
        selectedSeats.push(seat); 
      }
    });
  
    localStorage.setItem(`${selectedDate}_${selectedSession}`, JSON.stringify(storedBookings));
  
    selectedSeatDivs.forEach(seatDiv => seatDiv.classList.add('booked'));
  
    alert(`Вы забронировали места: ${selectedSeats.join(', ')} на сеанс ${selectedSession} в дату ${selectedDate}`);
  }
  