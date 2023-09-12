const compareDate = (startDate, endDate, dayDiff) => {
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);
  var oneWeekTime =
    new Date(startDate).getTime() + (dayDiff - 1) * 24 * 60 * 60 * 1000;
  //                                      day hour  min  sec  msec

  if (newEndDate.getTime() < newStartDate.getTime()) {
    alert("End Date Can't be less than Start Date!.");
    return true;
  }

  if (newEndDate.getTime() > oneWeekTime) {
    alert("End Date Can't be more than 7 days!.");
    return true;
  }

  return false;
};

export default compareDate;
