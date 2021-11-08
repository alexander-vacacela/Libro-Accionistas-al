/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEstadoCatalogo = /* GraphQL */ `
  query GetEstadoCatalogo($id: ID!) {
    getEstadoCatalogo(id: $id) {
      id
      nombre
      nombreCorto
      createdAt
      updatedAt
    }
  }
`;
export const listEstadoCatalogos = /* GraphQL */ `
  query ListEstadoCatalogos(
    $filter: ModelEstadoCatalogoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEstadoCatalogos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nombre
        nombreCorto
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTipoPersona = /* GraphQL */ `
  query GetTipoPersona($id: ID!) {
    getTipoPersona(id: $id) {
      id
      nombre
      nombreCorto
      estado
      createdAt
      updatedAt
    }
  }
`;
export const listTipoPersonas = /* GraphQL */ `
  query ListTipoPersonas(
    $filter: ModelTipoPersonaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTipoPersonas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nombre
        nombreCorto
        estado
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTipoIdentificacion = /* GraphQL */ `
  query GetTipoIdentificacion($id: ID!) {
    getTipoIdentificacion(id: $id) {
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
export const listTipoIdentificacions = /* GraphQL */ `
  query ListTipoIdentificacions(
    $filter: ModelTipoIdentificacionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTipoIdentificacions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        nombre
        nombreCorto
        estado
        tipoPersona
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEstadoCivil = /* GraphQL */ `
  query GetEstadoCivil($id: ID!) {
    getEstadoCivil(id: $id) {
      id
      nombre
      estado
      createdAt
      updatedAt
    }
  }
`;
export const listEstadoCivils = /* GraphQL */ `
  query ListEstadoCivils(
    $filter: ModelEstadoCivilFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEstadoCivils(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nombre
        estado
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPais = /* GraphQL */ `
  query GetPais($id: ID!) {
    getPais(id: $id) {
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
export const listPais = /* GraphQL */ `
  query ListPais(
    $filter: ModelPaisFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPais(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nombre
        nombreCorto
        nacionalidad
        codigoTelefono
        estado
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProvincia = /* GraphQL */ `
  query GetProvincia($id: ID!) {
    getProvincia(id: $id) {
      id
      nombre
      Pais
      estado
      createdAt
      updatedAt
    }
  }
`;
export const listProvincias = /* GraphQL */ `
  query ListProvincias(
    $filter: ModelProvinciaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProvincias(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nombre
        Pais
        estado
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCiudad = /* GraphQL */ `
  query GetCiudad($id: ID!) {
    getCiudad(id: $id) {
      id
      nombre
      Provincia
      estado
      createdAt
      updatedAt
    }
  }
`;
export const listCiudads = /* GraphQL */ `
  query ListCiudads(
    $filter: ModelCiudadFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCiudads(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nombre
        Provincia
        estado
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTipoMedioContacto = /* GraphQL */ `
  query GetTipoMedioContacto($id: ID!) {
    getTipoMedioContacto(id: $id) {
      id
      nombre
      estado
      createdAt
      updatedAt
    }
  }
`;
export const listTipoMedioContactos = /* GraphQL */ `
  query ListTipoMedioContactos(
    $filter: ModelTipoMedioContactoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTipoMedioContactos(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        nombre
        estado
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCuentaBancaria = /* GraphQL */ `
  query GetCuentaBancaria($id: ID!) {
    getCuentaBancaria(id: $id) {
      id
      nombre
      nombreCorto
      estado
      createdAt
      updatedAt
    }
  }
`;
export const listCuentaBancarias = /* GraphQL */ `
  query ListCuentaBancarias(
    $filter: ModelCuentaBancariaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCuentaBancarias(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        nombre
        nombreCorto
        estado
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEstadoAccionista = /* GraphQL */ `
  query GetEstadoAccionista($id: ID!) {
    getEstadoAccionista(id: $id) {
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
export const listEstadoAccionistas = /* GraphQL */ `
  query ListEstadoAccionistas(
    $filter: ModelEstadoAccionistaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEstadoAccionistas(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        nombre
        nombreCorto
        descripcion
        estado
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAccionista = /* GraphQL */ `
  query GetAccionista($id: ID!) {
    getAccionista(id: $id) {
      id
      tipoIdentificacion
      identificacion
      nombre
      direccionPais
      direccionProvincia
      direccionCiudad
      direccionCalle
      direccionNumero
      nombreBanco
      tipoCuenta
      cuentaBancaria
      paisNacionalidad
      cantidadAcciones
      participacion
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
      repLegal_tipoIdentificacion
      repLegal_identificacion
      repLegal_nombre
      repLegal_nacionalidad
      repLegal_telefono
      repLegal_email
      telefono1
      obs1
      telefono2
      obs2
      telefono3
      obs3
      email1
      email2
      email3
      docIdentidadPrincipal
      docCertificadoBancario
      docIdentidadConyugue
      herederos
      esHeredero
      decevale
      titulos {
        items {
          id
          accionistaID
          titulo
          acciones
          fechaCompra
          estado
          idCedenteHereda
          nombreCedenteHereda
          desde
          hasta
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
export const listAccionistas = /* GraphQL */ `
  query ListAccionistas(
    $filter: ModelAccionistaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccionistas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tipoIdentificacion
        identificacion
        nombre
        direccionPais
        direccionProvincia
        direccionCiudad
        direccionCalle
        direccionNumero
        nombreBanco
        tipoCuenta
        cuentaBancaria
        paisNacionalidad
        cantidadAcciones
        participacion
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
        repLegal_tipoIdentificacion
        repLegal_identificacion
        repLegal_nombre
        repLegal_nacionalidad
        repLegal_telefono
        repLegal_email
        telefono1
        obs1
        telefono2
        obs2
        telefono3
        obs3
        email1
        email2
        email3
        docIdentidadPrincipal
        docCertificadoBancario
        docIdentidadConyugue
        herederos
        esHeredero
        decevale
        titulos {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTitulo = /* GraphQL */ `
  query GetTitulo($id: ID!) {
    getTitulo(id: $id) {
      id
      accionistaID
      titulo
      acciones
      fechaCompra
      estado
      idCedenteHereda
      nombreCedenteHereda
      desde
      hasta
      createdAt
      updatedAt
    }
  }
`;
export const listTitulos = /* GraphQL */ `
  query ListTitulos(
    $filter: ModelTituloFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTitulos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        accionistaID
        titulo
        acciones
        fechaCompra
        estado
        idCedenteHereda
        nombreCedenteHereda
        desde
        hasta
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getHeredero = /* GraphQL */ `
  query GetHeredero($id: ID!) {
    getHeredero(id: $id) {
      id
      accionistaHerederoId
      nombre
      cantidad
      idCedente
      nombreCedente
      estado
      createdAt
      updatedAt
    }
  }
`;
export const listHerederos = /* GraphQL */ `
  query ListHerederos(
    $filter: ModelHerederoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHerederos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        accionistaHerederoId
        nombre
        cantidad
        idCedente
        nombreCedente
        estado
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOperaciones = /* GraphQL */ `
  query GetOperaciones($id: ID!) {
    getOperaciones(id: $id) {
      id
      fecha
      operacion
      idCedente
      cedente
      titulo
      acciones
      idCesionario
      cesionario
      estado
      usuarioIngreso
      usuarioAprobador
      titulos {
        items {
          id
          operacionID
          tituloId
          titulo
          acciones
          accionesTransferidas
          desde
          hasta
          createdAt
          updatedAt
        }
        nextToken
      }
      cs
      cg
      ci
      es
      cp
      ced
      cb
      nom
      fechaAprobacion
      motivoRechazo
      observacion
      createdAt
      updatedAt
    }
  }
`;
export const listOperaciones = /* GraphQL */ `
  query ListOperaciones(
    $filter: ModelOperacionesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOperaciones(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        fecha
        operacion
        idCedente
        cedente
        titulo
        acciones
        idCesionario
        cesionario
        estado
        usuarioIngreso
        usuarioAprobador
        titulos {
          nextToken
        }
        cs
        cg
        ci
        es
        cp
        ced
        cb
        nom
        fechaAprobacion
        motivoRechazo
        observacion
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTituloPorOperacion = /* GraphQL */ `
  query GetTituloPorOperacion($id: ID!) {
    getTituloPorOperacion(id: $id) {
      id
      operacionID
      tituloId
      titulo
      acciones
      accionesTransferidas
      desde
      hasta
      createdAt
      updatedAt
    }
  }
`;
export const listTituloPorOperacions = /* GraphQL */ `
  query ListTituloPorOperacions(
    $filter: ModelTituloPorOperacionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTituloPorOperacions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        operacionID
        tituloId
        titulo
        acciones
        accionesTransferidas
        desde
        hasta
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getHerederoPorOperacion = /* GraphQL */ `
  query GetHerederoPorOperacion($id: ID!) {
    getHerederoPorOperacion(id: $id) {
      id
      operacionId
      numeroHeredero
      herederoId
      nombre
      cantidad
      createdAt
      updatedAt
    }
  }
`;
export const listHerederoPorOperacions = /* GraphQL */ `
  query ListHerederoPorOperacions(
    $filter: ModelHerederoPorOperacionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHerederoPorOperacions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        operacionId
        numeroHeredero
        herederoId
        nombre
        cantidad
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getNumeroSecuencial = /* GraphQL */ `
  query GetNumeroSecuencial($id: ID!) {
    getNumeroSecuencial(id: $id) {
      id
      numerotitulo
      createdAt
      updatedAt
    }
  }
`;
export const listNumeroSecuencials = /* GraphQL */ `
  query ListNumeroSecuencials(
    $filter: ModelNumeroSecuencialFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNumeroSecuencials(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        numerotitulo
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getParametro = /* GraphQL */ `
  query GetParametro($id: ID!) {
    getParametro(id: $id) {
      id
      moneda
      cantidadEmitida
      createdAt
      updatedAt
    }
  }
`;
export const listParametros = /* GraphQL */ `
  query ListParametros(
    $filter: ModelParametroFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listParametros(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        moneda
        cantidadEmitida
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
