import { classicTheme, proTheme, lightTheme } from './colors'

import fs from 'fs'

const generateCSS = () => {
  const css = `
    .classic {
      --color-darkness: ${classicTheme.darkness};
      --color-smoke: ${classicTheme.smoke};
      --color-carmesi: ${classicTheme.carmesi};
      --color-white: ${classicTheme.white};
      --color-greySmoke: ${classicTheme.greySmoke};
    }

    .pro {
      --color-darkness: ${proTheme.darkness};
      --color-smoke: ${proTheme.smoke};
      --color-carmesi: ${proTheme.carmesi};
      --color-white: ${proTheme.white};
      --color-greySmoke: ${proTheme.greySmoke};
    }
    
    .light {
      --color-darkness: ${lightTheme.darkness};
      --color-smoke: ${lightTheme.smoke};
      --color-carmesi: ${lightTheme.carmesi};
      --color-white: ${lightTheme.white};
      --color-greySmoke: ${lightTheme.greySmoke};
    }
  `

  fs.writeFileSync('./src/styles/_theme.css', css)
}

generateCSS()
