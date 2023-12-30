import { PokemonGender } from "../../constants/types"

export type GenderProps = {
    gender: PokemonGender;
}

export const Gender = ({ gender }: GenderProps) => {
    return <span className={gender === PokemonGender.MALE ? 'gender-male' : 'gender-female'}>{gender}</span>
}