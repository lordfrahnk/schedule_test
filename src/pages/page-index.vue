<template>
  <div class="flex">
    <div class="w-1/4 bg-gray-200">
      <div>Roster</div>
      <div>
        <div 
          v-for="user in roster" 
          :key="user.name"
        >
          <div>{{ user.name }}</div>
          <div class="hidden">{{ user.schedule }}</div>
        </div>
      </div>
    </div>
    <div class="flex-grow bg-gray-100">
      <div>Heatmap</div>
      <div>
        <table>
          <thead>
            <th></th>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </thead>
          <tbody>
            <tr>
              <td>8:00am</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>{{ friday }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
    }
  },

  methods: {}
}
</script>

<style>
.heading {
  @apply text-gray-800 uppercase;
}
</style>
