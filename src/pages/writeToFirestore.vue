<template></template>
<script setup>
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

import { locationStore } from "stores/location";
const store = locationStore();

const locations = store.locationsFilteredArray;
console.log(locations);

//馬上執行
locations.forEach((location) => {
  console.log(location.id);
  const cityRef = doc(getFirestore(), "FunParks", location.id);
  setDoc(cityRef, location);
});
</script>
