import { LocationPuck } from "@rnmapbox/maps";

export default function UserLocationLayer() {
  return <LocationPuck visible pulsing="default" puckBearingEnabled puckBearing="heading" />;
}

//  <UserLocation
//    showsUserHeadingIndicator
//    visible
//    animated
//    onPress={() => {
//      console.log("test");
//    }}
//  />;
