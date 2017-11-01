function displayBreaks() {
    document.getElementById('workSession').style.display="none";
    document.getElementById('breakSession').style.display="block";
    document.getElementsByClassName('session-type')[0].innerHTML="Break Time";
    document.getElementsByClassName('section--index')[0].style.backgroundColor="#42a5f0";
}

function displayWorks() {
    document.getElementById('breakSession').style.display="none";
    document.getElementById('workSession').style.display="block";
    document.getElementsByClassName('session-type')[0].innerHTML="Work Time";
    document.getElementsByClassName('section--index')[0].style.backgroundColor="#6b6de2";
}

$("#rateYo").rateYo({
    rating: 2,
    fullStar: true
  });
