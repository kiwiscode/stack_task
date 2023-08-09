import { useRef, useState, useEffect } from "react";

function Calendar() {
  const today = new Date();
  const yearNum = today.getFullYear();
  let monthNum = today.getMonth() + 1; // string
  const renderMonth = useRef(monthNum);

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [currMonth, setCurrMonth] = useState(monthNum - 1);

  let monthStr;
  function handleIncreaseCurrentMonth() {
    renderMonth.current += 1;
    monthStr = month[renderMonth.current - 1];
    console.log(monthStr);
    setCurrMonth(monthStr);
    return monthStr;
  }
  console.log(currMonth);
  function handleDecreaseCurrentMonth() {
    renderMonth.current -= 1;
    monthStr = month[renderMonth.current - 1];
    setCurrMonth(monthStr);
    return monthStr;
  }

  useEffect(() => {
    handleDecreaseCurrentMonth();
    handleIncreaseCurrentMonth();
  }, []);

  const liTags = [];
  const lastDateOfMonth = new Date(yearNum, monthNum - 1, 0).getDate();
  for (let i = 1; i < lastDateOfMonth + 1; i++) {
    liTags.push(<li key={i}>{i}</li>);
  }

  return (
    <>
      <div>
        <div className="wrapper">
          <header>
            <p className="current-date">{`${currMonth} ${yearNum}`}</p>
            <div className="icons">
              <span
                className="material-symbols-rounded"
                onClick={handleDecreaseCurrentMonth}
              >
                chevron_left
              </span>
              <span
                className="material-symbols-rounded"
                onClick={handleIncreaseCurrentMonth}
              >
                chevron_right
              </span>
            </div>
          </header>
          <div className="calendar">
            <ul className="weeks">
              <li>Sun</li>
              <li>Mon</li>
              <li>Tue</li>
              <li>Wed</li>
              <li>Thu</li>
              <li>Fri</li>
              <li>Sat</li>
            </ul>
            <ul className="days">{liTags}</ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;
