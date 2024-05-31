import knex from "knex";
import { development } from "./knexfile.mjs";

const connection = knex(development)

export default connection