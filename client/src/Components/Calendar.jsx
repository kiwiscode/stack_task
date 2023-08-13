import { useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import CheckIcon from "@mui/icons-material/Check";
import { Button } from "@mui/material";
import { TimePickerComponent } from "@syncfusion/ej2-react-calendars";

const Calendar = (props) => {
  const today = new Date();
  const [highlightedDays, setHighlightedDays] = useState([1, 2, 13]);
  const [selectedTime, setSelectedTime] = useState("");
  const [hours, setHours] = useState("");
  const [minute, setMinute] = useState("");

  const [value, setValue] = useState({
    year: today.getFullYear(),
    day: today.getDate(),
    month: today.getMonth() + 1,
  });

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    setHours(
      `${
        newTime.value.getHours().toString() < 10
          ? "0" + newTime.value.getHours().toString()
          : newTime.value.getHours().toString()
      }`
    );
    setMinute(
      `${
        newTime.value.getMinutes().toString() < 10
          ? "0" + newTime.value.getMinutes().toString()
          : newTime.value.getMinutes().toString()
      }`
    );

    props.changeTimeAndDate(newTime.value);
  };
  console.log(hours, ":", minute);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePickerComponent
        placeholder="Select a time"
        id="time"
        format={"HH:mm"}
        step={10}
        onChange={handleTimeChange}
      ></TimePickerComponent>
      <p>Time{`${hours}:${minute}`}</p>
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
              badgeContent={isSelected ? <CheckIcon color="red" /> : undefined}
            >
              <PickersDay {...DayComponentProps} />
            </Badge>
          );
        }}
      />

      <Button onClick={() => props.changeTimeAndDate(value)}>Save</Button>
    </LocalizationProvider>
  );
};

export default Calendar;
