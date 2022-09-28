import defaultSlugify from 'slugify'

export default function slugify(someString: string) {
  return defaultSlugify(someString,  { lower: true, remove: /[']/g })
} 
