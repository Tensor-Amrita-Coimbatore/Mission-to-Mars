// This file contains a sample gameState object for frontend testing.
export const mockGameState = {
  game_status: 'in_progress',
  narrative: 'A solar flare has damaged the Mars base! Systems are critical. Your first task is to reroute power from the science labs to life support.',
  current_image: '/images/mars_base.png', // Make sure you have a placeholder image here
  current_round: 1,
  teams: [
    {
      id: 'team1',
      name: 'TEAM PHOENIX',
      score: 150,
      members: ['PLAYER_1', 'PHOENIX_1'],
      tasks: [
        {
          assigned_to: 'PHOENIX_1',
          scenario_desc: 'The main power grid is offline. You must bypass the damaged conduits.',
          task_desc: 'Describe the three-step emergency power rerouting protocol.',
        },
      ],
    },
    {
      id: 'team2',
      name: 'TEAM ORION',
      score: 120,
      members: ['PLAYER_2'],
      tasks: [
        {
          assigned_to: 'PLAYER_2',
          scenario_desc: 'The comms array is misaligned. You must recalibrate the dish.',
          task_desc: 'What is the correct calibration angle for the primary satellite?',
        },
      ],
    },
    {
      id: 'team3',
      name: 'TEAM VEGA',
      score: 100,
      members: ['PLAYER_3'],
      tasks: [
        {
          assigned_to: 'PLAYER_3',
          scenario_desc: 'Oxygen filters are clogged. You need to purge the system.',
          task_desc: 'Enter the 4-digit purge command for the O2 filters.',
        },
      ],
    },
  ],
};