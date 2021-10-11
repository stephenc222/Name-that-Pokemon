import { MAX_POKEMON_NUMBER } from "constants/index"

export const getRandomPokemonID = () => Math.floor(Math.random() * MAX_POKEMON_NUMBER) + 1

export const getPokemonItem = ({name, sprites: { front_default }}: any) => ({
  name,
  imgUri: front_default 
})