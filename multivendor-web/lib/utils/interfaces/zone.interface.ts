export interface IMapZone {
  _id: string;
  title: string;
  description: string;
  location: {
    coordinates: number[][][];
  };
  isActive: boolean;
}

interface PolygonLocation {
  coordinates: number[][][]; 
  __typename: "Polygon";
}

export interface IArea {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  location: PolygonLocation;
}
