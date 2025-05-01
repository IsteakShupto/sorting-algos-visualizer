import { useState } from "react";
import { data, slowDownSorting } from "./utils/utils";
import "./App.css";

function App() {
  const [arr, setArr] = useState(data);

  const [isSorting, setIsSorting] = useState(false);
  const [rangeValue, setRangeValue] = useState(100);

  async function insertionSort(): Promise<void> {
    setIsSorting(true);
    const newArr: { value: number; state: string }[] = [...arr];
    for (let i = 1; i < newArr.length; i++) {
      const curr = newArr[i].value;
      let j = i - 1;
      while (j >= 0 && newArr[j].value > curr) {
        newArr[j + 1].state = "active";
        newArr[j].state = "active";
        newArr[j + 1].value = newArr[j].value;
        await slowDownSorting(rangeValue);
        setArr([...newArr]);
        j--;
      }
      newArr[j + 1].value = curr;
      newArr[j + 1].state = "active";

      await slowDownSorting(rangeValue);
      for (let i = 0; i < newArr.length; i++) {
        newArr[i].state = "";
      }
      setArr([...newArr]);
    }

    for (let i = 0; i < newArr.length; i++) {
      newArr[i].state = "sorted";
    }
    setArr([...newArr]);
    setIsSorting(false);
  }

  async function bubbleSort(): Promise<void> {
    setIsSorting(true);
    const newArr: { value: number; state: string }[] = [...arr];
    for (let i = 0; i < newArr.length; i++) {
      let isSwapped: boolean = false;
      for (let j = 0; j < newArr.length - 1; j++) {
        if (newArr[j].value > newArr[j + 1].value) {
          newArr[j + 1].state = "active";
          newArr[j].state = "active";
          const temp: number = newArr[j].value;
          newArr[j].value = newArr[j + 1].value;
          newArr[j + 1].value = temp;
          await slowDownSorting(rangeValue);
          setArr([...newArr]);
          isSwapped = true;
        }
      }
      if (isSwapped == false) {
        break;
      } else {
        await slowDownSorting(rangeValue);
        for (let i = 0; i < newArr.length; i++) {
          newArr[i].state = "";
        }
        setArr([...newArr]);
      }
    }

    for (let i = 0; i < newArr.length; i++) {
      newArr[i].state = "sorted";
    }
    setArr([...newArr]);
    setIsSorting(false);
  }

  async function selectionSort(): Promise<void> {
    setIsSorting(true);
    const newArr: { value: number; state: string }[] = [...arr];
    for (let i = 0; i < newArr.length - 1; i++) {
      let min_elem_idx: number = i;
      for (let j = i + 1; j < newArr.length; j++) {
        if (newArr[j].value < newArr[min_elem_idx].value) {
          newArr[j].state = "active";
          newArr[min_elem_idx].state = "active";
          min_elem_idx = j;
        }
      }
      const temp: number = newArr[min_elem_idx].value;
      newArr[min_elem_idx].value = newArr[i].value;
      newArr[i].value = temp;

      await slowDownSorting(rangeValue);
      setArr([...newArr]);
    }

    for (let i = 0; i < newArr.length; i++) {
      newArr[i].state = "sorted";
    }
    setArr([...newArr]);
    setIsSorting(false);
  }

  async function mergeArrays(
    arrCopy: { value: number; state: string }[],
    left: number,
    mid: number,
    right: number
  ): Promise<void> {
    for (let i = 0; i < arrCopy.length; i++) {
      arrCopy[i].state = "";
    }
    const newArr: { value: number; state: string }[] = [...arrCopy];
    const merged: { value: number; state: string }[] = [];
    let i: number = left;
    let j: number = mid + 1;
    while (i <= mid && j <= right) {
      if (newArr[i].value < newArr[j].value) {
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
      arrCopy[l].state = "active";
      i++;
    }

    await slowDownSorting(rangeValue);
    setArr([...arrCopy]);
  }

  async function mergeSort(
    arrCopy: { value: number; state: string }[],
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
    arrCopy: { value: number; state: string }[],
    left: number,
    right: number
  ): Promise<number> {
    for (let i = 0; i < arrCopy.length; i++) {
      arrCopy[i].state = "";
    }
    const pivot: { value: number; state: string } = arrCopy[right];
    const arrLeft: { value: number; state: string }[] = [];
    const arrRight: { value: number; state: string }[] = [];
    let count: number = 0;
    for (let i = left; i <= right - 1; i++) {
      if (arrCopy[i].value < pivot.value) {
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
      arrCopy[i].state = "active";
      j++;
    }

    await slowDownSorting(rangeValue);
    setArr([...arrCopy]);
    return left + count;
  }

  async function quickSort(
    arrCopy: { value: number; state: string }[],
    left: number,
    right: number
  ): Promise<void> {
    if (left < right) {
      const pivotIdx: number = await partition(arrCopy, left, right);
      await quickSort(arrCopy, left, pivotIdx - 1);
      await quickSort(arrCopy, pivotIdx + 1, right);
    }
  }

  function handleReset() {
    setIsSorting(false);
    setArr(data);
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
              const newArr: { value: number; state: string }[] = [...arr];
              for (let i = 0; i < newArr.length; i++) {
                newArr[i].state = "sorted";
              }
              setArr([...newArr]);
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
              await quickSort(arr, 0, arr.length - 1);
              const newArr: { value: number; state: string }[] = [...arr];
              for (let i = 0; i < newArr.length; i++) {
                newArr[i].state = "sorted";
              }
              setArr([...newArr]);
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
              min={"1"}
              max={"1000"}
            />
          </div>
        </div>
        <div className="app-right">
          <div className="arr-bar-container">
            {arr.map((val, valIndex) => (
              <div key={valIndex}>
                <div
                  className={`arr-bar ${val.state}`}
                  style={{ height: `${val.value * 12}px` }}
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
