import { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import CheckIcon from "@mui/icons-material/Check";
import { Button } from "@mui/material";

const Calendar = (props) => {
  const today = new Date();
  const [highlightedDays, setHighlightedDays] = useState([1, 2, 13]);
  const [calendar, setCalendar] = useState("hide");

  const [value, setValue] = useState({
    year: today.getFullYear(),
    day: today.getDate(),
    month: today.getMonth() + 1,
  });

  const showCalendar = () => {
    setCalendar("");
  };

  return (
    <div>
      <button onClick={showCalendar}>Pick a date</button>
      <div className={`calendar ${calendar}`}>
        <LocalizationProvider dateAdapter={AdapterDateFns} classNam>
          <StaticDatePicker
            variant="static"
            orientation="portrait"
            value={value}
            disableFuture={false}
            onChange={(newValue) => setValue(newValue)}
            renderInput={(params) => {
              <TextField {...params} />;
            }}
            renderDay={(day, _value, DayComponentProps) => {
              const isSelected =
                !DayComponentProps.outsideCurrentMonth &&
                highlightedDays.indexOf(day.getDate()) >= 0;

              return (
                <Badge
                  key={day.toString()}
                  overlap="circular"
                  badgeContent={
                    isSelected ? <CheckIcon color="red" /> : undefined
                  }
                >
                  <PickersDay {...DayComponentProps} />
                </Badge>
              );
            }}
          />

          <Button onClick={() => props.changeTimeAndDate(value)}>Save</Button>
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default Calendar;
