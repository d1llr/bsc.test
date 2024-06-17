/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      'animation': {
        'gradient-x': 'gradient-x 1s ease infinite',
        'gradient-y': 'gradient-y 15s ease-in-out infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      'keyframes': {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      backgroundImage: {
        'gameShards': "url('/src/images/icons/game-item-shards.png')",
        'gameLeftToRightShards': "url('/src/images/icons/from-left-shards.svg')",
      },
      backgroundColor: {
        'yellow': 'rgb(255, 241, 0)',
        'hoverYellow': 'rgb(210, 199, 6)',
        'gray': '#898989',
        'hoverGray': '#626262',
        'lighterGray': 'rgb(27, 27, 27)',
      },
      colors: {
        'yellow': 'rgb(255, 241, 0)',
        'hoverYellow': 'rgb(210, 199, 6)',
        'gray': '#898989',
        'textGray': 'rgb(137, 137, 137)',
        'lightGray': 'rgb(39, 39, 39)',
        'lightGrayHover': 'rgba(98, 98, 98, 1)',
        'customBlack': 'rgb(13, 13, 13)',
        'customBlackHover': 'rgb(27, 27, 27)',
        'urlGray': 'rgb(98, 98, 98)',
        'eyeBlack': 'rgba(0, 0, 0, 0.25)',
      },
      borderColor: {
        'gray': '#3F3F3F'
      },
      content: {
        'exit': 'url("/src/images/icons/exit-account.svg")',
      },
    },
    fontFamily: {
      orbitron: [
        '"Orbitron", sans-serif',
      ],
      beausans: [
        '"PF BeauSans Pro", sans-serif'
      ],
      chakra: [
        '"Chakra Petch", sans-serif'
      ]
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}