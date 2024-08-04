import axios from "axios"
const BASE_URL="https://places.googleapis.com/v1/places:searchNearby"
const API_KEY="key"


const config ={
    headers:{
        'Context-Type':'application/json',
        "X-Goog-Api-Key": API_KEY,
        'X-Goog-FieldMask': ['places.displayName', 'places.formattedAddress', 'places.location', 'places.parkingOptions', 'places.photos', 'places.shortFormattedAddress', 'places.id', ]
    }
}


const NewNearByPlace=(data)=>axios.post(BASE_URL, data, config);

export default{
    NewNearByPlace,
    API_KEY
}