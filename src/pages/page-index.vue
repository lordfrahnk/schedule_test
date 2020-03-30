<template>
  <div class="flex h-full">
    <div class="w-1/5 border-r bg-gray-200">
      <!-- <div class="pt-8 p-2">
        <div class="text-gray-900">Roster</div>
      </div> -->
      <div>
        <div class="bg-white flex items-center justify-between p-2 border-b">
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
          class="bg-white shadow-sm p-2 border-b hover:bg-gray-100 cursor-pointer"
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
    <div class="w-4/5 p-8">
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
              class="border-b pb-1"
            >
              <span>{{ day | formatDay }}</span>
            </th>
          </thead>
          <tbody>
            <tr
              v-for="(days, hour) in schedule" 
              :key="`hour_${hour}`" 
              class="hover:bg-gray-1000"
            >
              <td class="p-1">
                <span>{{ hour | formatHour }}</span>
                <span>-</span>
                <span>{{ (parseInt(hour) + 1) | formatHour }}</span>
              </td>
              <td 
                v-for="(data, day) in days" 
                :key="`hour_${hour}_${day}`" 
                class="border leading-none p-1 text-gray-800 text-center"
                :style="{ backgroundColor: (Object.keys(data).indexOf(mouseover_uid) !== -1) ? heatmapHighlight : '#fff' }"
              >
                <div class="bg-white">
                  <div 
                    class="p-2"
                    :style="{ 'background-color': `rgba(${heatmapColor},${heatmapWeight(Object.values(data).length)})` }"
                  >{{ Object.values(data).length }}</div>
                </div>
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

/**
 * Change these values whenever
 */
const config = {
  heatmap: {
    color: {
      r: 0,
      g: 100,
      b: 250
    },
    highlight: 'rgb(114, 152, 225)',
    weights: {
      in_min: 0,
      in_max: 10,
      out_min: 0,
      out_max: 1,
    }
  },

  schedule: {
    start_time: 8,
    end_time: 21
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
        {
          uid: 'taylorfranklin',
          name: 'Taylor Franklin',
          schedule: {
            ...this.emptyUserSchedule(),
            '0': '8-9',
            '1': '9-17',
            '2': '9-17',
            '3': '9-17',
            '4': '9-17',
            '5': '9-17'
          }
        },
        {
          uid: 'lebraunpremo',
          name: 'LeBraun Premo',
          schedule: {
            ...this.emptyUserSchedule(),
            '1': '14-16'
          }
        }
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

    // '8': {
    //   '0': {
    //     'taylorfranklin': 1
    //   },
    // }
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
          // e.g. ('8-10') becomes ['8', '10']
          const hoursArr = user.schedule[day].split('-')
          // Only continue if the array contains data
          if (hoursArr.length > 0) {
            // Convert start and end time to a range of hours
            const hours = range(hoursArr[0], hoursArr[1])
            // Loop through hours
            hours.forEach(hour => {
              // Normalize the user's hours as the schedule pbject expects
              schedule[hour][day][user.uid] = 1
            })
          }
        })
      })

      return schedule;
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

    workingHours (schedule) {
      return Object.keys(schedule)
        .map(day => {
          const hoursArr = schedule[day].split('-')
          // Convert start and end time to a range of hours
          const hours = range(hoursArr[0], hoursArr[1])
          return hours.length
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
