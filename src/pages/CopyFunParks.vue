<template>
  <div>
    <!-- 排序改增加 citySort欄位 -->
    <q-btn label="addSortField" @click="addSortField"></q-btn>
    <!-- 以下練習資料庫備份、增加欄位-->
    <!-- <q-btn label="複製FunParks => FunParks2" @click="saveFunparks2"></q-btn> -->
    <q-separator></q-separator>
    <q-btn label="複製FunParks => FunParks3" @click="save3"></q-btn>
    <q-separator></q-separator>
    <q-btn label="複製FunParks2 => FunParks" @click="save2"></q-btn>
  </div>
</template>
<script setup>
import { ref, reactive, computed, toRefs } from "vue";

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
} from "firebase/firestore";

const data = reactive({
  FunParks: [],
});

const Parks = [];
queryFunParks();
function queryFunParks() {
  try {
    const q = query(
      collection(getFirestore(), "FunParks") //,
      // orderBy("id", "desc")
    );
    getDocs(q).then((qSnap) => {
      qSnap.forEach((doc) => {
        let sort = "";
        if (doc.id.includes("台北市")) {
          sort = "B";
        } else if (doc.id.includes("新北市")) {
          sort = "C";
        } else if (doc.id.includes("屏東縣")) {
          sort = "A";
        }
        const park = { ...doc.data() };
        park.排序 = sort;

        Parks.push(park); //陣列
      });
      // data.FunParks = Parks;
      console.log(Parks);
    });
  } catch (error) {
    console.error("Firestore 錯誤", error);
  }
}
function addSortField() {
  Parks.forEach((park) => {
    updateFunpark(park);
  });
}

async function updateFunpark(park) {
  console.log(park.id);

  try {
    const funParkRef = doc(getFirestore(), "FunParks", park.id);
    await updateDoc(funParkRef, park);
  } catch (error) {
    console.error("firebase 存檔有錯誤發生");
  }
}
//---------------------------------------------------

async function query3() {
  const Parks3 = [];
  try {
    const q = await query(
      collection(getFirestore(), "FunParks"),
      orderBy("id", "desc")
    );
    return getDocs(q).then((qSnap) => {
      qSnap.forEach((doc) => {
        Parks3.push({ id: doc.id, ...doc.data() }); //陣列
      });
      // data.FunParks = Parks;
      console.log(Parks3);
      return Parks3;
    });
  } catch (error) {
    console.error("Firestore 錯誤", error);
  }
}

async function save3() {
  const parks3 = await query3();
  parks3.forEach((park) => {
    // console.log(park.id);
    saveFunpark3(park);
  });
}

async function saveFunpark3(park) {
  console.log(park.id);

  try {
    const funParkRef = doc(getFirestore(), "FunParks3", park.id);
    await setDoc(funParkRef, park);
  } catch (error) {
    console.error("firebase 存檔有錯誤發生");
  }
}

//--------------------------222222222222222222-------------------------

async function query2() {
  const Parks2 = [];
  try {
    const q = await query(
      collection(getFirestore(), "FunParks2"),
      orderBy("id", "asc")
    );
    return getDocs(q).then((qSnap) => {
      qSnap.forEach((doc) => {
        Parks2.push({ id: doc.id, ...doc.data() }); //陣列
      });
      // data.FunParks = Parks;
      console.log(Parks2);
      return Parks2;
    });
  } catch (error) {
    console.error("Firestore 錯誤", error);
  }
}

async function save2() {
  const parks2 = await query2();
  parks2.forEach((park) => {
    console.log(park.id);
    saveFunpark(park);
  });
}

async function saveFunpark(park) {
  console.log(park.id);
  // 先刪除FunParks，再執行
  // try {
  //   const funParkRef = doc(getFirestore(), "FunParks", park.id);
  //   await setDoc(funParkRef, park);
  // } catch (error) {
  //   console.error("firebase 存檔有錯誤發生");
  // }
}
</script>
