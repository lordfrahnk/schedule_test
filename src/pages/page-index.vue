<template>
  <div class="flex h-full">
    <div class="w-1/4 overflow-scroll h-full border-r-8 border-gray-200 bg-white">
      <div class="bg-white pt-8 p-2">
        <div class="text-xl text-gray-900">Roster</div>
      </div>
      <div>
        <div class="bg-white flex items-center justify-between p-2 border-b border-gray-200">
          <div class="flex items-center">
            <div class="mr-2">
              <input 
                type="checkbox" 
                class="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" 
                v-model="selectAll"
                @click="toggle_all_active_uids"
              />
            </div>
            <label class="text-xs font-semibold">Select all</label>
          </div>
          <div>
            <button class="border px-2 py-1 font-semibold rounded-md shadow-sm text-xs text-gray-800" @click="form.visible = !form.visible">Add user</button>
          </div>
        </div>
        <div v-show="form.visible" class="border-b bg-gray-100 px-2 py-1">
          <form @submit.prevent="handleForm">
            <input 
              class="text-sm text-gray-800 rounded-md shadow-sm border p-1 px-2 w-full"
              placeholder="Full name"
              type="text" 
              v-model="form.name"
            >
          </form>
        </div>
        <div 
          v-for="user in sortedRoster" 
          :key="user.uid"
          class="bg-white p-2 border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
          v-on:mouseover="mouseover_uid = user.uid"
          v-on:mouseleave="mouseover_uid = null"
        >
        <div class="flex items-center">
          <div class="mr-2">
            <input
              type="checkbox" 
              class="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              :value="user.uid"
              v-model="active_uids"
              @click="selectAll = false"
            />
          </div>
          <div class="flex-grow text-sm text-gray-800">
            <span class="mr-2">{{ user.name }}</span>
            <span class="text-xs text-gray-600">({{ workingHours(user.schedule) }} hrs)</span>
          </div>
          <div>
            <button 
              class="bg-white border px-2 py-1 font-semibold rounded-md shadow-sm text-xs text-gray-800" 
              @click="removeUserFromRoster(user.uid)"
            >Delete</button>
          </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-3/4 p-8">
      <div class="bg-white">
        <div class="text-xl text-gray-900">Schedule</div>
      </div>
      <!-- <div class="text-gray-900">Schedule</div>
      <div class="mt-10">
        <button class="border px-2 py-1 font-semibold rounded-md shadow-sm text-xs text-gray-800">Show heatmap</button>
      </div> -->
      <div class="mt-0">
        <table class="cursor-default table-fixed" cellpadding="0">
          <thead>
            <th class=""></th>
            <th 
              v-for="(arr, day) in days" 
              :key="`th_${day}`"
              class="border-b border-gray-200 pb-1"
            >
              <span>{{ day | formatDay }}</span>
            </th>
          </thead>
          <tbody>
            <tr
              v-for="(days, hour) in schedule" 
              :key="`hour_${hour}`" 
            >
              <td class="p-1">
                <span>{{ hour | formatHour }}</span>
                <!-- <span>-</span> -->
                <!-- <span>{{ (parseInt(hour) + 1) | formatHour }}</span> -->
              </td>
              <td 
                v-for="(data, day) in days" 
                :key="`hour_${hour}_${day}`" 
                class="border border-gray-200 leading-none p-1 text-gray-800 text-center"
                :style="{ backgroundColor: (Object.keys(data).indexOf(mouseover_uid) !== -1) ? heatmapHighlight : '#fff' }"
              >
                <div class="bg-white">
                  <div 
                    class="p-2"
                    :style="{ 'background-color': `rgba(${heatmapColor},${heatmapWeight(Object.values(data).length)})` }"
                  >
                    <span class="opacity-75">{{ Object.values(data).length > 0 ? Object.values(data).reduce((acc, num) => acc + num) : 0 }}</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="border-t-2" v-show="active_uids.length === 1">
              <td class="py-6 font-bold">{{ selectedUser.name }}</td>
              <td
                v-for="(arr, day) in days"
                :key="`form_${day}`"
              >
                <input 
                  type="text" 
                  class="border p-1 inline-block w-full" 
                  placeholder="8-10"
                  v-model="selectedUser.schedule[`${day}`]"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import dayjs from 'dayjs'
import { range, spread } from '@/utils/helpers'
import rosterData from '@/store/roster.json'

/**
 * Change these values whenever
 */
const config = {
  heatmap: {
    color: {
      r: 108,
      g: 189,
      b: 72
    },
    highlight: 'rgba(0, 0, 0, 1)',
    weights: {
      in_min: 0,
      in_max: 20,
      out_min: 0,
      out_max: 1,
    }
  },

  schedule: {
    start_time: 6,
    end_time: 23
  }
}

/**
 * Page logic
 */
export default {
  data () {
    return {
      active_uids: [],

      form: {
        visible: false,
        name: null
      },

      mouseover_uid: null,

      roster: [
        ...rosterData
      ],

      selectAll: false
    }
  },

  computed: {
    activeRoster () {
      if (this.active_uids.length > 0) {
        return this.roster
          .filter(user => this.active_uids.indexOf(user.uid) !== -1)
      }
      else {
        return this.roster
      }
    },

    sortedRoster () {
      const compare = (a, b) => {
        if (a.uid < b.uid)
          return -1;
        if (a.uid > b.uid)
          return 1;
        return 0;
      }
        
      return [...this.roster].sort(compare);
    },

    days () {
      return Object.values(this.schedule)[0]
    },

    heatmapColor () {
      const { r, g, b } = config.heatmap.color
      return `${r},${g},${b}`
    },

    heatmapHighlight () {
      return config.heatmap.highlight
    },

    schedule () {
      // Build an empty schedule for the view to loop through and create the table
      const schedule = {
        ...this.emptySchedule()
      }

      const roster = this.activeRoster

      // Build schedule object from activeRoster
      roster.forEach(user => {
        // Loop through each day in the user's schedule
        Object.keys(user.schedule).forEach(day => {
          // Convert the day's hours string as an array where position "0" is the start time and  position "1" is the end time
          // e.g. '8-10' becomes ['8', '10'] 
          // e.g. '' becomes []
          const hoursArr = user.schedule[day].split('-')
          // Only continue if the array contains data
          if (hoursArr.length > 1) {
            // Convert start and end time to a range of hours
            const startTime = this.parseTime(hoursArr[0], false)
            const endTime = this.parseTime(hoursArr[1], true)
            const hours = range(startTime, endTime) // 6, 6 

            // const s = '6:30am' => 6 should return 6
            // const e = '7:00am' => 7 should return 6

            // Loop through hours
            hours.forEach(hour => {
              // Normalize the user's hours as the schedule pbject expects
              schedule[hour][day][user.uid] = 1
            })

            if (hoursArr[0].match(/:30/)) {
              // if start time has a "":30"
              schedule[startTime][day][user.uid] = 0.5
            }

            if (hoursArr[1].match(/:30/)) {
              // if end time has a "":30"
              schedule[endTime][day][user.uid] = 0.5
            }
          }
        })
      })

      return schedule;
    },

    selectedUser () {
      if (this.active_uids.length === 1) {
        const active_uid = this.active_uids[0]
        return this.roster.filter(user => user.uid === active_uid)[0]
      }
      else {
        return this.roster[0]
      }
    }
  },

  filters: {
    formatDay: (day) => {
      return dayjs()
        .day(parseInt(day))
        .format('dddd')
    },

    formatHour: (hour) => {
      return dayjs()
        .hour(parseInt(hour))
        .format('h:00a')
    }
  },

  methods: {
    emptySchedule () {
      const hours = range(config.schedule.start_time, config.schedule.end_time);
      const days = range(0, 6);
      const schedule = {}

      hours.forEach(hour => {
        schedule[hour] = {}
        days.forEach(day => {
          schedule[hour][day] = {}
        })
      })

      return schedule
    },

    emptyUserSchedule () {
      return {
        '0': '',
        '1': '',
        '2': '',
        '3': '',
        '4': '',
        '5': '',
        '6': ''
      }
    },

    heatmapWeight (val) {
      const { in_min, in_max, out_min, out_max } = config.heatmap.weights
      return spread(val, in_min, in_max, out_min, out_max)
    },

    removeUserFromRoster (uid) {
      const index = this.roster.map(u => u.uid).indexOf(uid)
      this.roster.splice(index, 1);
    },

    toggle_all_active_uids () {
      if (this.selectAll) {
        this.active_uids = [...this.roster.map(user => user.uid)] 
      }
      else {
        this.active_uids = [] 
      }
    },

    handleForm () {
      const name = this.form.name;
      const uid = name.toLowerCase().replace(/\s+/g, '');

      const data = {
        uid,
        name,
        schedule: {
          ...this.emptyUserSchedule()
        }
      }

      Vue.set(this.roster, this.roster.length, data);

      this.form.name = ''
    },

    parseTime(time, isEndTime=true) {
      const timeParts = time.split(':');
      
      let timeInteger = parseInt(timeParts[0])

      if (timeInteger !== 12 && timeParts[1].match(/pm/)) {
        timeInteger += 12
      }

      if (isEndTime && !time.match(/:30/)) {
        timeInteger -= 1
      }

      return timeInteger
    },

    workingHours (schedule) {
      return Object.keys(schedule)
        .map(day => {
          const hoursArr = schedule[day].split('-')

          if (hoursArr.length > 1) {
            // Convert start and end time to a range of hours
            
            const startTime = this.parseTime(hoursArr[0], false)
            const endTime = this.parseTime(hoursArr[1], true)
            const hours = range(startTime, endTime)// => 8, 9 , 10, 11, 12, 1

            let totalHours = hours.length

            if (hoursArr[0].match(/:30/)) {
              // if start time has a "":30"
              totalHours -= 0.5
            }

            if (hoursArr[1].match(/:30/)) {
              // if end time has a "":30"
              totalHours -= 0.5
            }

            return totalHours
          }
          else {
            return 0
          }
        })
        .reduce((acc, num) => acc + num)
    }
  },

  watch: {
    selectAll: function ( ) {
      this.toggle_all_active_uids()
    }
  }
}
</script>

<style>
.heading {
  @apply text-gray-800 uppercase;
}

table {
  @apply w-full;
}

th {
  @apply font-medium text-xs text-gray-700 table-cell;
}

tbody {
  @apply bg-white;
}

td {
  @apply font-semibold text-xs text-gray-700 table-cell;
}

</style>
