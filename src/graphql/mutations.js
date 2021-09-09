/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEstadoCatalogo = /* GraphQL */ `
  mutation CreateEstadoCatalogo(
    $input: CreateEstadoCatalogoInput!
    $condition: ModelEstadoCatalogoConditionInput
  ) {
    createEstadoCatalogo(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      createdAt
      updatedAt
    }
  }
`;
export const updateEstadoCatalogo = /* GraphQL */ `
  mutation UpdateEstadoCatalogo(
    $input: UpdateEstadoCatalogoInput!
    $condition: ModelEstadoCatalogoConditionInput
  ) {
    updateEstadoCatalogo(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      createdAt
      updatedAt
    }
  }
`;
export const deleteEstadoCatalogo = /* GraphQL */ `
  mutation DeleteEstadoCatalogo(
    $input: DeleteEstadoCatalogoInput!
    $condition: ModelEstadoCatalogoConditionInput
  ) {
    deleteEstadoCatalogo(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      createdAt
      updatedAt
    }
  }
`;
export const createTipoPersona = /* GraphQL */ `
  mutation CreateTipoPersona(
    $input: CreateTipoPersonaInput!
    $condition: ModelTipoPersonaConditionInput
  ) {
    createTipoPersona(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      estado
      createdAt
      updatedAt
    }
  }
`;
export const updateTipoPersona = /* GraphQL */ `
  mutation UpdateTipoPersona(
    $input: UpdateTipoPersonaInput!
    $condition: ModelTipoPersonaConditionInput
  ) {
    updateTipoPersona(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      estado
      createdAt
      updatedAt
    }
  }
`;
export const deleteTipoPersona = /* GraphQL */ `
  mutation DeleteTipoPersona(
    $input: DeleteTipoPersonaInput!
    $condition: ModelTipoPersonaConditionInput
  ) {
    deleteTipoPersona(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      estado
      createdAt
      updatedAt
    }
  }
`;
export const createTipoIdentificacion = /* GraphQL */ `
  mutation CreateTipoIdentificacion(
    $input: CreateTipoIdentificacionInput!
    $condition: ModelTipoIdentificacionConditionInput
  ) {
    createTipoIdentificacion(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      estado
      tipoPersona
      createdAt
      updatedAt
    }
  }
`;
export const updateTipoIdentificacion = /* GraphQL */ `
  mutation UpdateTipoIdentificacion(
    $input: UpdateTipoIdentificacionInput!
    $condition: ModelTipoIdentificacionConditionInput
  ) {
    updateTipoIdentificacion(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      estado
      tipoPersona
      createdAt
      updatedAt
    }
  }
`;
export const deleteTipoIdentificacion = /* GraphQL */ `
  mutation DeleteTipoIdentificacion(
    $input: DeleteTipoIdentificacionInput!
    $condition: ModelTipoIdentificacionConditionInput
  ) {
    deleteTipoIdentificacion(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      estado
      tipoPersona
      createdAt
      updatedAt
    }
  }
`;
export const createEstadoCivil = /* GraphQL */ `
  mutation CreateEstadoCivil(
    $input: CreateEstadoCivilInput!
    $condition: ModelEstadoCivilConditionInput
  ) {
    createEstadoCivil(input: $input, condition: $condition) {
      id
      nombre
      estado
      createdAt
      updatedAt
    }
  }
`;
export const updateEstadoCivil = /* GraphQL */ `
  mutation UpdateEstadoCivil(
    $input: UpdateEstadoCivilInput!
    $condition: ModelEstadoCivilConditionInput
  ) {
    updateEstadoCivil(input: $input, condition: $condition) {
      id
      nombre
      estado
      createdAt
      updatedAt
    }
  }
`;
export const deleteEstadoCivil = /* GraphQL */ `
  mutation DeleteEstadoCivil(
    $input: DeleteEstadoCivilInput!
    $condition: ModelEstadoCivilConditionInput
  ) {
    deleteEstadoCivil(input: $input, condition: $condition) {
      id
      nombre
      estado
      createdAt
      updatedAt
    }
  }
`;
export const createPais = /* GraphQL */ `
  mutation CreatePais(
    $input: CreatePaisInput!
    $condition: ModelPaisConditionInput
  ) {
    createPais(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      nacionalidad
      codigoTelefono
      estado
      createdAt
      updatedAt
    }
  }
`;
export const updatePais = /* GraphQL */ `
  mutation UpdatePais(
    $input: UpdatePaisInput!
    $condition: ModelPaisConditionInput
  ) {
    updatePais(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      nacionalidad
      codigoTelefono
      estado
      createdAt
      updatedAt
    }
  }
`;
export const deletePais = /* GraphQL */ `
  mutation DeletePais(
    $input: DeletePaisInput!
    $condition: ModelPaisConditionInput
  ) {
    deletePais(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      nacionalidad
      codigoTelefono
      estado
      createdAt
      updatedAt
    }
  }
`;
export const createProvincia = /* GraphQL */ `
  mutation CreateProvincia(
    $input: CreateProvinciaInput!
    $condition: ModelProvinciaConditionInput
  ) {
    createProvincia(input: $input, condition: $condition) {
      id
      nombre
      Pais
      estado
      createdAt
      updatedAt
    }
  }
`;
export const updateProvincia = /* GraphQL */ `
  mutation UpdateProvincia(
    $input: UpdateProvinciaInput!
    $condition: ModelProvinciaConditionInput
  ) {
    updateProvincia(input: $input, condition: $condition) {
      id
      nombre
      Pais
      estado
      createdAt
      updatedAt
    }
  }
`;
export const deleteProvincia = /* GraphQL */ `
  mutation DeleteProvincia(
    $input: DeleteProvinciaInput!
    $condition: ModelProvinciaConditionInput
  ) {
    deleteProvincia(input: $input, condition: $condition) {
      id
      nombre
      Pais
      estado
      createdAt
      updatedAt
    }
  }
`;
export const createCiudad = /* GraphQL */ `
  mutation CreateCiudad(
    $input: CreateCiudadInput!
    $condition: ModelCiudadConditionInput
  ) {
    createCiudad(input: $input, condition: $condition) {
      id
      nombre
      Provincia
      estado
      createdAt
      updatedAt
    }
  }
`;
export const updateCiudad = /* GraphQL */ `
  mutation UpdateCiudad(
    $input: UpdateCiudadInput!
    $condition: ModelCiudadConditionInput
  ) {
    updateCiudad(input: $input, condition: $condition) {
      id
      nombre
      Provincia
      estado
      createdAt
      updatedAt
    }
  }
`;
export const deleteCiudad = /* GraphQL */ `
  mutation DeleteCiudad(
    $input: DeleteCiudadInput!
    $condition: ModelCiudadConditionInput
  ) {
    deleteCiudad(input: $input, condition: $condition) {
      id
      nombre
      Provincia
      estado
      createdAt
      updatedAt
    }
  }
`;
export const createTipoMedioContacto = /* GraphQL */ `
  mutation CreateTipoMedioContacto(
    $input: CreateTipoMedioContactoInput!
    $condition: ModelTipoMedioContactoConditionInput
  ) {
    createTipoMedioContacto(input: $input, condition: $condition) {
      id
      nombre
      estado
      createdAt
      updatedAt
    }
  }
`;
export const updateTipoMedioContacto = /* GraphQL */ `
  mutation UpdateTipoMedioContacto(
    $input: UpdateTipoMedioContactoInput!
    $condition: ModelTipoMedioContactoConditionInput
  ) {
    updateTipoMedioContacto(input: $input, condition: $condition) {
      id
      nombre
      estado
      createdAt
      updatedAt
    }
  }
`;
export const deleteTipoMedioContacto = /* GraphQL */ `
  mutation DeleteTipoMedioContacto(
    $input: DeleteTipoMedioContactoInput!
    $condition: ModelTipoMedioContactoConditionInput
  ) {
    deleteTipoMedioContacto(input: $input, condition: $condition) {
      id
      nombre
      estado
      createdAt
      updatedAt
    }
  }
`;
export const createCuentaBancaria = /* GraphQL */ `
  mutation CreateCuentaBancaria(
    $input: CreateCuentaBancariaInput!
    $condition: ModelCuentaBancariaConditionInput
  ) {
    createCuentaBancaria(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      estado
      createdAt
      updatedAt
    }
  }
`;
export const updateCuentaBancaria = /* GraphQL */ `
  mutation UpdateCuentaBancaria(
    $input: UpdateCuentaBancariaInput!
    $condition: ModelCuentaBancariaConditionInput
  ) {
    updateCuentaBancaria(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      estado
      createdAt
      updatedAt
    }
  }
`;
export const deleteCuentaBancaria = /* GraphQL */ `
  mutation DeleteCuentaBancaria(
    $input: DeleteCuentaBancariaInput!
    $condition: ModelCuentaBancariaConditionInput
  ) {
    deleteCuentaBancaria(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      estado
      createdAt
      updatedAt
    }
  }
`;
export const createEstadoAccionista = /* GraphQL */ `
  mutation CreateEstadoAccionista(
    $input: CreateEstadoAccionistaInput!
    $condition: ModelEstadoAccionistaConditionInput
  ) {
    createEstadoAccionista(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      descripcion
      estado
      createdAt
      updatedAt
    }
  }
`;
export const updateEstadoAccionista = /* GraphQL */ `
  mutation UpdateEstadoAccionista(
    $input: UpdateEstadoAccionistaInput!
    $condition: ModelEstadoAccionistaConditionInput
  ) {
    updateEstadoAccionista(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      descripcion
      estado
      createdAt
      updatedAt
    }
  }
`;
export const deleteEstadoAccionista = /* GraphQL */ `
  mutation DeleteEstadoAccionista(
    $input: DeleteEstadoAccionistaInput!
    $condition: ModelEstadoAccionistaConditionInput
  ) {
    deleteEstadoAccionista(input: $input, condition: $condition) {
      id
      nombre
      nombreCorto
      descripcion
      estado
      createdAt
      updatedAt
    }
  }
`;
export const createAccionista = /* GraphQL */ `
  mutation CreateAccionista(
    $input: CreateAccionistaInput!
    $condition: ModelAccionistaConditionInput
  ) {
    createAccionista(input: $input, condition: $condition) {
      id
      tipoIdentificacion
      identificacion
      nombre
      direccionPais
      direccionProvincia
      direccionCiudad
      direccionCalle
      direccionNumero
      bancoPais
      nombreBanco
      tipoCuenta
      cuentaBancaria
      paisNacionalidad
      cantidadAcciones
      tipoAcciones
      estado
      tipoPersona
      pn_primerNombre
      pn_segundoNombre
      pn_apellidoPaterno
      pn_apellidoMaterno
      pn_estadoCivil
      conyugue_tipoIdentificacion
      conyugue_identificacion
      conyugue_nombre
      conyugue_nacionalidad
      conyugue_observaciones
      repLegal_tipoIdentificacion
      repLegal_identificacion
      repLegal_nombre
      repLegal_nacionalidad
      titulos {
        items {
          id
          accionistaID
          titulo
          acciones
          fechaCompra
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateAccionista = /* GraphQL */ `
  mutation UpdateAccionista(
    $input: UpdateAccionistaInput!
    $condition: ModelAccionistaConditionInput
  ) {
    updateAccionista(input: $input, condition: $condition) {
      id
      tipoIdentificacion
      identificacion
      nombre
      direccionPais
      direccionProvincia
      direccionCiudad
      direccionCalle
      direccionNumero
      bancoPais
      nombreBanco
      tipoCuenta
      cuentaBancaria
      paisNacionalidad
      cantidadAcciones
      tipoAcciones
      estado
      tipoPersona
      pn_primerNombre
      pn_segundoNombre
      pn_apellidoPaterno
      pn_apellidoMaterno
      pn_estadoCivil
      conyugue_tipoIdentificacion
      conyugue_identificacion
      conyugue_nombre
      conyugue_nacionalidad
      conyugue_observaciones
      repLegal_tipoIdentificacion
      repLegal_identificacion
      repLegal_nombre
      repLegal_nacionalidad
      titulos {
        items {
          id
          accionistaID
          titulo
          acciones
          fechaCompra
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteAccionista = /* GraphQL */ `
  mutation DeleteAccionista(
    $input: DeleteAccionistaInput!
    $condition: ModelAccionistaConditionInput
  ) {
    deleteAccionista(input: $input, condition: $condition) {
      id
      tipoIdentificacion
      identificacion
      nombre
      direccionPais
      direccionProvincia
      direccionCiudad
      direccionCalle
      direccionNumero
      bancoPais
      nombreBanco
      tipoCuenta
      cuentaBancaria
      paisNacionalidad
      cantidadAcciones
      tipoAcciones
      estado
      tipoPersona
      pn_primerNombre
      pn_segundoNombre
      pn_apellidoPaterno
      pn_apellidoMaterno
      pn_estadoCivil
      conyugue_tipoIdentificacion
      conyugue_identificacion
      conyugue_nombre
      conyugue_nacionalidad
      conyugue_observaciones
      repLegal_tipoIdentificacion
      repLegal_identificacion
      repLegal_nombre
      repLegal_nacionalidad
      titulos {
        items {
          id
          accionistaID
          titulo
          acciones
          fechaCompra
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createTitulo = /* GraphQL */ `
  mutation CreateTitulo(
    $input: CreateTituloInput!
    $condition: ModelTituloConditionInput
  ) {
    createTitulo(input: $input, condition: $condition) {
      id
      accionistaID
      titulo
      acciones
      fechaCompra
      createdAt
      updatedAt
    }
  }
`;
export const updateTitulo = /* GraphQL */ `
  mutation UpdateTitulo(
    $input: UpdateTituloInput!
    $condition: ModelTituloConditionInput
  ) {
    updateTitulo(input: $input, condition: $condition) {
      id
      accionistaID
      titulo
      acciones
      fechaCompra
      createdAt
      updatedAt
    }
  }
`;
export const deleteTitulo = /* GraphQL */ `
  mutation DeleteTitulo(
    $input: DeleteTituloInput!
    $condition: ModelTituloConditionInput
  ) {
    deleteTitulo(input: $input, condition: $condition) {
      id
      accionistaID
      titulo
      acciones
      fechaCompra
      createdAt
      updatedAt
    }
  }
`;
export const createOperaciones = /* GraphQL */ `
  mutation CreateOperaciones(
    $input: CreateOperacionesInput!
    $condition: ModelOperacionesConditionInput
  ) {
    createOperaciones(input: $input, condition: $condition) {
      id
      fecha
      operacion
      cedente
      titulo
      acciones
      cesionario
      estado
      usuarioIngreso
      usuarioAprobador
      imagen1
      imagen2
      imagen3
      imagen4
      imagen5
      imagen6
      imagen7
      imagen8
      imagen9
      createdAt
      updatedAt
    }
  }
`;
export const updateOperaciones = /* GraphQL */ `
  mutation UpdateOperaciones(
    $input: UpdateOperacionesInput!
    $condition: ModelOperacionesConditionInput
  ) {
    updateOperaciones(input: $input, condition: $condition) {
      id
      fecha
      operacion
      cedente
      titulo
      acciones
      cesionario
      estado
      usuarioIngreso
      usuarioAprobador
      imagen1
      imagen2
      imagen3
      imagen4
      imagen5
      imagen6
      imagen7
      imagen8
      imagen9
      createdAt
      updatedAt
    }
  }
`;
export const deleteOperaciones = /* GraphQL */ `
  mutation DeleteOperaciones(
    $input: DeleteOperacionesInput!
    $condition: ModelOperacionesConditionInput
  ) {
    deleteOperaciones(input: $input, condition: $condition) {
      id
      fecha
      operacion
      cedente
      titulo
      acciones
      cesionario
      estado
      usuarioIngreso
      usuarioAprobador
      imagen1
      imagen2
      imagen3
      imagen4
      imagen5
      imagen6
      imagen7
      imagen8
      imagen9
      createdAt
      updatedAt
    }
  }
`;
