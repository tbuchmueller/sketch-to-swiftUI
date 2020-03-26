const { copyFonts } = require('./copyFonts')
const { addOptionalProperty, doRound, colorToRGBA } = require('./processShared')

async function processTextStyles(textStyles, outputFolder) {
    let ret = []

    let fontNames = []

    for (let index = 0; index < textStyles.length; ++index) {
        let style = textStyles[index]
        let textStyle = style.value.textStyle
        let verticalAlignment = style.value.verticalAlignment
        let allStyles = style.value
        let encodedAttributes = textStyle.encodedAttributes
        let fontAttributes = encodedAttributes.MSAttributedStringFontAttribute.attributes
        let paragraphStyle = encodedAttributes.paragraphStyle
        let color = encodedAttributes.MSAttributedStringColorAttribute

        // Store the font name - we deal with the fonts at the end
        if (!fontNames.includes(fontAttributes.name)) {
            fontNames.push(fontAttributes.name)
        }

        let data = {
            name: style.name,
            style: [
                { name: "font", value: fontNameAndSize(fontAttributes) },
                { name: "foregroundColor", value: getColor(color) }
                /*
                { name: "vertical-align", value: verticalAlign(textStyle) },
                { name: "text-transform", value: textTransform(encodedAttributes) }*/
            ],
            text: []
        }
        addOptionalProperty("tracking", data.text, tracking(encodedAttributes)) // Same as Kerning
        addOptionalProperty("lineSpacing", data.text, lineSpacing(paragraphStyle))
        addOptionalProperty("multilineTextAlignment", data.text, textAlign(paragraphStyle))
        addOptionalProperty("shadow", data.text, textShadow(allStyles))
        addOptionalProperty("blur", data.text, textBlur(allStyles))
        addOptionalProperty("underline", data.text, textUnderline(encodedAttributes))
        addOptionalProperty("strikethrough", data.text, textStrikethrough(encodedAttributes))
        ret.push(data)
    }

    let fonts = await copyFonts(fontNames, outputFolder)

    return { text: ret, fonts: fonts }
}
module.exports = { processTextStyles: processTextStyles }

const fontNameAndSize = (fontAttributes) => {
    return `Font.custom("${fontAttributes.name}", size: ${fontAttributes.size})`
}

const tracking = (encodedAttributes) => {
    return encodedAttributes.kerning
}

const lineSpacing = (paragraphStyle) => {
    return doRound(paragraphStyle.minimumLineHeight)
}

const getColor = (color) => {
    return `${colorToRGBA(color.red, color.green, color.blue, color.alpha)}`
}

const textAlign = (paragraphStyle) => {
    const options = [".leading", ".trailing", ".center"]
    let val = paragraphStyle.alignment
    if (val < options.length) {
        return options[val]
    }
}

const textShadow = (shadowStyles) => {
  let shadows = shadowStyles.shadows
  if (shadows !== undefined && shadows.length > 0) {
      let shadowArray = []
      for(let i=0;i<shadows.length;i++){
        let shadow = shadows[i]
        if (shadow.isEnabled == true) {
          let shadowColor = colorToRGBA(shadow.color.red, shadow.color.green, shadow.color.blue, shadow.color.alpha)
          shadowArray.push(`color: ${shadowColor}, radius: ${shadow.blurRadius}, x: ${doRound(shadow.offsetX)}, y: ${doRound(shadow.offsetY)}`)
        }
      }
      return shadowArray
  }
}

const textBlur = (textStyles) => {
  let blur = textStyles.blur
  if (blur.isEnabled == true) {
    return `radius: ${blur.radius}`
  }
}

const textUnderline = (encodedAttributes) => {
  if (encodedAttributes.underlineStyle == 1) {
    return true
  }
}

const textStrikethrough = (encodedAttributes) => {
  if (encodedAttributes.strikethroughStyle == 1) {
   return true
  }
}