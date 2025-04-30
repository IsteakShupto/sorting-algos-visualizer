import { useState } from "react";
import { slowDownSorting } from "./utils/utils";
import "./App.css";

function App() {
  const [arr, setArr] = useState([
    8, 7, 20, 2, 3, 8, 12, 21, 32, 3, 8, 9, 5, 47, 21, 56, 6, 12, 3, 8, 9, 5, 8,
    7, 20, 2, 3, 23, 1, 3, 4, 20, 3, 21, 9, 22, 4, 6, 3, 9, 5, 8, 7, 20, 2, 3,
    23, 1, 3, 4, 20, 3, 21, 9, 1, 2, 3, 6, 3, 3, 24, 1, 20, 31, 22, 4, 6, 3, 3,
    21, 9, 1, 2, 3, 6, 3, 3, 4, 1, 20, 31, 22, 4, 6, 3, 1, 3, 4, 20, 3, 21, 9,
    6, 3, 3, 4, 1, 20, 31, 22, 4, 32, 44, 6, 3, 29, 3, 23, 1, 3, 4, 20, 3, 21,
    9, 22, 9, 1, 42, 3, 6, 9, 51, 2, 3,
  ]);

  const [isSorting, setIsSorting] = useState(false);
  const [rangeValue, setRangeValue] = useState(100);

  async function insertionSort(): Promise<void> {
    setIsSorting(true);
    const newArr: number[] = [...arr];
    for (let i = 1; i < newArr.length; i++) {
      const curr = newArr[i];
      let j = i - 1;
      while (j >= 0 && newArr[j] > curr) {
        newArr[j + 1] = newArr[j];
        await slowDownSorting(rangeValue);
        setArr([...newArr]);
        j--;
      }
      newArr[j + 1] = curr;
      await slowDownSorting(rangeValue);
      setArr([...newArr]);
    }
    setIsSorting(false);
  }

  async function bubbleSort(): Promise<void> {
    setIsSorting(true);
    const newArr: number[] = [...arr];
    for (let i = 0; i < newArr.length; i++) {
      let isSwapped: boolean = false;
      for (let j = 0; j < newArr.length - 1; j++) {
        if (newArr[j] > newArr[j + 1]) {
          const temp: number = newArr[j];
          newArr[j] = newArr[j + 1];
          newArr[j + 1] = temp;
          await slowDownSorting(rangeValue);
          setArr([...newArr]);
          isSwapped = true;
        }
      }
      if (isSwapped == false) {
        break;
      } else {
        await slowDownSorting(rangeValue);
        setArr([...newArr]);
      }
    }
    setIsSorting(false);
  }

  async function selectionSort(): Promise<void> {
    setIsSorting(true);
    const newArr: number[] = [...arr];
    for (let i = 0; i < newArr.length - 1; i++) {
      let min_elem_idx: number = i;
      for (let j = i + 1; j < newArr.length; j++) {
        if (newArr[j] < newArr[min_elem_idx]) {
          min_elem_idx = j;
        }
      }
      const temp: number = newArr[min_elem_idx];
      newArr[min_elem_idx] = newArr[i];
      newArr[i] = temp;
      await slowDownSorting(rangeValue);
      setArr([...newArr]);
    }
    setIsSorting(false);
  }

  async function mergeArrays(
    arrCopy: number[],
    left: number,
    mid: number,
    right: number
  ): Promise<void> {
    const newArr: number[] = [...arrCopy];
    const merged: number[] = [];
    let i: number = left;
    let j: number = mid + 1;
    while (i <= mid && j <= right) {
      if (newArr[i] < newArr[j]) {
        merged.push(newArr[i]);
        i++;
      } else {
        merged.push(newArr[j]);
        j++;
      }
    }
    while (i <= mid) {
      merged.push(newArr[i]);
      i++;
    }
    while (j <= right) {
      merged.push(newArr[j]);
      j++;
    }
    i = 0;
    for (let l = left; l <= right; l++) {
      arrCopy[l] = merged[i];
      i++;
    }

    await slowDownSorting(rangeValue);
    setArr([...arrCopy]);
  }

  async function mergeSort(
    arrCopy: number[],
    left: number,
    right: number
  ): Promise<void> {
    if (left >= right) return;
    const mid = Math.floor(left + (right - left) / 2);
    await mergeSort(arrCopy, left, mid);
    await mergeSort(arrCopy, mid + 1, right);
    await mergeArrays(arrCopy, left, mid, right);
  }

  async function partition(
    arrCopy: number[],
    left: number,
    right: number
  ): Promise<number> {
    const pivot: number = arrCopy[right];
    const arrLeft: number[] = [];
    const arrRight: number[] = [];
    let count: number = 0;
    for (let i = left; i <= right - 1; i++) {
      if (arrCopy[i] < pivot) {
        arrLeft.push(arrCopy[i]);
        count++;
      } else {
        arrRight.push(arrCopy[i]);
      }
    }
    let j: number = 0;
    for (let i = left; i < left + count; i++) {
      arrCopy[i] = arrLeft[j];
      j++;
    }
    arrCopy[left + count] = pivot;
    j = 0;
    for (let i = left + count + 1; i <= right; i++) {
      arrCopy[i] = arrRight[j];
      j++;
    }

    await slowDownSorting(rangeValue);
    setArr([...arrCopy]);
    return left + count;
  }

  async function quirkSort(
    arrCopy: number[],
    left: number,
    right: number
  ): Promise<void> {
    if (left < right) {
      const pivotIdx: number = await partition(arrCopy, left, right);
      await quirkSort(arrCopy, left, pivotIdx - 1);
      await quirkSort(arrCopy, pivotIdx + 1, right);
    }
  }

  function handleReset() {
    setIsSorting(false);
    setArr([
      8, 7, 20, 2, 3, 8, 12, 21, 32, 3, 8, 9, 5, 47, 21, 56, 6, 12, 3, 8, 9, 5,
      8, 7, 20, 2, 3, 23, 1, 3, 4, 20, 3, 21, 9, 22, 4, 6, 3, 9, 5, 8, 7, 20, 2,
      3, 23, 1, 3, 4, 20, 3, 21, 9, 1, 2, 3, 6, 3, 3, 24, 1, 20, 31, 22, 4, 6,
      3, 3, 21, 9, 1, 2, 3, 6, 3, 3, 4, 1, 20, 31, 22, 4, 6, 3, 1, 3, 4, 20, 3,
      21, 9, 6, 3, 3, 4, 1, 20, 31, 22, 4, 32, 44, 6, 3, 29, 3, 23, 1, 3, 4, 20,
      3, 21, 9, 22, 9, 1, 42, 3, 6, 9, 51, 2, 3,
    ]);
  }

  return (
    <>
      <div className="app-container">
        <div className="app-left">
          <button
            className="btn btn-insertion"
            onClick={insertionSort}
            disabled={isSorting}
          >
            Insertion sort
          </button>
          <button
            className="btn btn-bubble"
            onClick={bubbleSort}
            disabled={isSorting}
          >
            Bubble sort
          </button>
          <button
            className="btn btn-selection"
            onClick={selectionSort}
            disabled={isSorting}
          >
            Selection sort
          </button>
          <button
            className="btn btn-selection"
            onClick={async () => {
              setIsSorting(true);
              await mergeSort(arr, 0, arr.length - 1);
              setIsSorting(false);
            }}
            disabled={isSorting}
          >
            Merge sort
          </button>
          <button
            className="btn btn-selection"
            onClick={async () => {
              setIsSorting(true);
              await quirkSort(arr, 0, arr.length - 1);
              setIsSorting(false);
            }}
            disabled={isSorting}
          >
            Quick sort
          </button>
          <button
            className="btn btn-reset"
            onClick={handleReset}
            disabled={isSorting}
          >
            Reset
          </button>
          <div className="btn btn-range">
            <input
              type="range"
              disabled={isSorting}
              defaultValue={rangeValue}
              onChange={(e) => setRangeValue(Number(e.target.value))}
              min={"50"}
              max={"200"}
            />
          </div>
        </div>
        <div className="app-right">
          <div className="arr-bar-container">
            {arr.map((val, valIndex) => (
              <div key={valIndex}>
                <div
                  className="arr-bar"
                  style={{ height: `${val * 10}px` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
