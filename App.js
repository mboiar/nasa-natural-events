import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import Constants from 'expo-constants';
 import RNPickerSelect from "react-native-picker-select";

// const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function App() {


  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({});

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value});
  };
    const queryParams = { ...filters };

    const queryString = Object.keys(queryParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`).join('&');

    const fetchEvent = async () => {
      try {
      const response = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?source=InciWeb&${queryString}`);
      const data = await response.json();
      console.log(data);
      setEvents(data.events);
    } catch (error) {
      console.log(error);
    }
    };
  useEffect(() => {
    fetchEvent();
  }, [])

  const categories = [
    {label: "Wildfires", value: "wildfires"},
    {label: "Earthquakes", value: "earthquakes"},
    {label: "Floods", value: "floods"},
    {label: "Landslides", value: "landslides"}
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        NASA natural events database
      </Text>
      <TextInput
        placeholder="Limit results"
        onChangeText={(text) => handleFilterChange('limit', text)}
      />

      <RNPickerSelect
        onValueChange={(value) => {
          handleFilterChange('category', value);
          setSelectedValue(value);
          }}
          items={categories}
      />

      <Button title="Filter" onPress={fetchEvent} />
      {events.length===0 ? (
        <Text>No events found</Text>
      ) : (

      <View className="events-container">
        {events.map((event) => {
          return (
            <View className="event" style={styles.container} key={event.id}>
              <Text style={styles.eventTitle}>
                {event.title}
              </Text>
              <View className="event-link">
                Source: {event.sources[0].url}
              </View>
              <View>
                Category: <View>{event.categories.map((category) => {
                  return (
                      <Text key={category.id}>{category.title}</Text>
                  )
                })}
                </View>
              </View>

            </View>
          )
        })}
      </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  title: {
    margin: 24,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  eventTitle: {
    fontSize: 22,
  },
});
