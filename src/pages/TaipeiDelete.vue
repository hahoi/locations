<template>
  <div>
    <q-list bordered separator>
      <div v-for="(item, key) in data.TaipeiPark" :key="key">
        <q-item clickable v-ripple
          ><q-item-section>
            <q-item-label class="text-h6">{{ item.名稱 }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn label="刪除" @click="delPark(item, key)"></q-btn>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
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
  TaipeiPark: [],
});

const Parks = [];
queryFunParks();
function queryFunParks() {
  try {
    const q = query(
      collection(getFirestore(), "FunParks"),
      orderBy("id", "desc")
    );
    getDocs(q).then((qSnap) => {
      qSnap.forEach((doc) => {
        Parks.push({ id: doc.id, ...doc.data() }); //陣列
      });
      const Tparks = Parks.filter((item, index) => {
        return item.id.includes("台北市");
      });
      data.TaipeiPark = Tparks;
      console.log(Tparks);
    });
  } catch (error) {
    console.error("Firestore 錯誤", error);
  }
}

function delPark(park, index) {
  console.log(park.id, index);

  // 刪除資料庫
  deleteDoc(doc(getFirestore(), "FunParks", park.id));

  data.TaipeiPark.splice(index, 1);
}
</script>
