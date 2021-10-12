export interface PokemonItem {
  name: string
  imgUri: string
}

export enum PLAY_PHASE {
  START = "START",
  PLAY = "PLAY",
  END = "END"
}
