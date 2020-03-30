<template>
  <div class="flex h-full">
    <div class="w-1/5 border-r">
      <div class="p-8">
        <div class="text-gray-900">Roster</div>
      </div>
      <div>
        <div class="flex items-center justify-between px-8 pr-2 py-2 border-b">
          <div class="flex items-center">
            <div class="mr-2">
              <input type="checkbox" class="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
            </div>
            <label class="text-xs font-semibold">Select all</label>
          </div>
          <div>
            <button class="border px-2 py-1 font-semibold rounded-md shadow-sm text-xs text-gray-800" @click="showForm = !showForm">Add user</button>
          </div>
        </div>
        <div v-show="showForm" class="border-b px-2 py-1">
          <form @submit.prevent="handleForm">
            <input 
              type="text" 
              placeholder="Full name"
              class="text-sm text-gray-800 rounded-md shadow-sm border p-1 px-2 w-full"
              v-model="form.name"
            >
          </form>
        </div>
        <div 
          v-for="user in roster" 
          :key="user.name"
          class="flex items-center px-8 py-2 pr-2 border-b hover:bg-gray-100 cursor-pointer"
          @mouseover="hover = user.name"
          @mouseleave="hover = null"
        >
          <div class="mr-2">
            <input type="checkbox" class="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
          </div>
          <div class="text-sm text-gray-800">{{ user.name }}</div>
          <div class="hidden">{{ user.schedule }}</div>
        </div>
      </div>
    </div>
    <div class="w-4/5 p-8">
      <div class="text-gray-900">Heatmap</div>
      <div class="mt-12">
        <table class="table-fixed cursor-default">
          <thead>
            <th></th>
            <th v-for="day in week" :key="day">{{ day }}</th>
          </thead>
          <tbody>
            <tr
              v-for="(hour, index) in hours" 
              :key="hour" 
              class="hover:bg-gray-200"
            >
              <td class="flex-shrink border p-1">
                {{ hour }}
                -
                {{ hours[index+1] }}
              </td>
              <td 
                v-for="day in week" 
                :key="day" 
                class="border p-1 opacity-250 text-gray-800 text-center"
                :class="{ [`bg-grayy-${getRandomInt(10)}00`]: true }"
              >
                {{ calc_data_for_hour_and_day(hour, day) }}
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

console.log(dayjs().hour(12));


const emptySchedule = {
  sunday: '',
  monday: '',
  tuesday: '',
  wednesday: '',
  thursday: '',
  friday: '',
  saturday: ''
}

export default {
  data () {
    return {
      form: {
        name: null
      },

      showForm: false,

      hover: null,

      week: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],

      hours: [
        '8:00am',
        '9:00am',
        '10:00am',
        '11:00am',
        '12:00pm',
        '1:00pm',
        '2:00pm',
        '3:00pm',
        '4:00pm',
        '5:00pm',
        '6:00pm',
        '7:00pm',
        '8:00pm',
        '9:00pm',
        '10:00pm'
      ],

      roster: [
        {
          name: 'Taylor Franklin',
          schedule: {
            sunday: '',
            monday: '3:00pm-5:00pm',
            tuesday: '6:00pm-8:00pm',
            wednesday: '',
            thursday: '',
            friday: '8:00am-12:00pm',
            saturday: ''
          }
        },
        {
          name: 'LeBraun Premo',
          schedule: {
            sunday: '3:00pm-5:00pm',
            monday: '',
            tuesday: '6:00pm-8:00pm',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '8:00am-12:00pm'
          }
        }
      ]
    }
  },

  computed: {
    friday () {
      return 1
    },

    schedule () {
      // return {
      //   '8': {
      //     sunday: [
      //       { 'taylorfranklin': 1 }
      //     ],
      //     monday: [],
      //     tuesday: [],
      //     wednesday: [],
      //     thursday: [],
      //     friday: [],
      //     saturday: []
      //   }
      // }

      return this.emptyDay();
    }
  },

  created() {
  },

  methods: {
    emptyDay () {
      const startTime = 8
      const endTime = 20
      const times = this.range(startTime, endTime);
      const days = this.range(0, 6);
      
      const schedule = {}

      times.forEach(time => {
        schedule[time] = {}
        days.forEach(day => {
          schedule[time][day] = []
        })
      })

      return schedule
    },

    range (low, high) {
      let list = [];
      for (var i = low; i <= high; i++) {
          list.push(i);
      }
      return list;
    },

    calc_data_for_hour_and_day (hour, day) {
      // console.log(hour, day);

      // should return the user names, then add those names as classes to trs, then trigger via hover
      const roster = [...this.roster]
        .map(r => r.schedule)
        .map(s => s[day.toLowerCase()])
        .filter(val => val !== '')
        .filter(val => {
          const split = val.split('-')
          const now = parseInt(hour.split(':')[0])
          const start = parseInt(split[0].split(':')[0])
          const end = parseInt(split[1].split(':')[0])
          
          return start <= now && now <= end;
        })
      
      return roster.length
    },

    getRandomInt (max) {
      return Math.floor(Math.random() * Math.floor(max));
    },

    handleForm () {
      const data = {
        name: this.form.name,
        schedule: {
          ...emptySchedule
        }
      }

      Vue.set(this.roster, this.roster.length, data);

      this.form.name = ''
    },

    spread (x, in_min, in_max, out_min, out_max) {
      return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
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
