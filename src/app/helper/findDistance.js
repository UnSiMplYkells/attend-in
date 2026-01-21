export default function getDistanceInMeters(myLat, myLon, classLat, classLon) {
  const R = 6371e3; // metres
  const φ1 = (myLat * Math.PI) / 180;
  const φ2 = (classLat * Math.PI) / 180;
  const Δφ = ((classLat - myLat) * Math.PI) / 180;
  const Δλ = ((classLon - myLon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const ans = R * c;
  const roundedAns = Math.round(ans * 100) / 100; //rounds to 2 decimal place

  return `${roundedAns}`;
}
