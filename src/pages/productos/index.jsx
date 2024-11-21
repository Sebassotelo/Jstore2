import React, { useContext, useEffect, useState } from "react";
import style from "../../styles/ProductosIndex.module.scss";
import ContextGeneral from "@/servicios/contextPrincipal";
import ItemMenuProductos from "@/componentes/ItemMenuProductos";
import ProductosTienda from "@/componentes/productos/ProductosTienda";
import Head from "next/head";
import { BiMenu } from "react-icons/bi";
import Loader from "@/componentes/Loader";
import { motion } from "framer-motion";

function Index() {
  const context = useContext(ContextGeneral);
  const { llamadaDB, setProductosPublicos, verificarLogin, setBusqueda } =
    useContext(ContextGeneral);

  const [showCategoria, setShowCategoria] = useState(false);

  // Función para agrupar productos por tipo y sección
  const agruparPorTipoYSeccion = () => {
    const agrupado = context.productosPublicosCopia.reduce((acc, producto) => {
      const { tipoProducto, seccion } = producto;

      if (!acc[tipoProducto]) {
        acc[tipoProducto] = new Set(); // Usamos Set para evitar duplicados
      }

      acc[tipoProducto].add(seccion);
      return acc;
    }, {});

    // Convertimos los sets a arrays
    return Object.entries(agrupado).map(([tipoProducto, secciones]) => ({
      tipoProducto,
      secciones: Array.from(secciones),
    }));
  };

  const categorias = agruparPorTipoYSeccion();

  // Filtrar productos por tipo y sección
  const filtrarSeccion = (seccion, tipoProducto) => {
    const nuevoArray = context.productosPublicosCopia.filter(
      (item) => item.seccion === seccion && item.tipoProducto === tipoProducto
    );
    setProductosPublicos(nuevoArray);
  };

  const filtrarSeccionOfertas = () => {
    const nuevoArray = context.productosPublicosCopia.filter(
      (item) => item.descuento
    );
    setProductosPublicos(nuevoArray);
  };

  const mostrarMenu = () => {
    setShowCategoria(!showCategoria);
  };

  useEffect(() => {
    if (context.productosPublicos.length === 0) {
      llamadaDB();
    }
    verificarLogin();
  }, [context.productosPublicos, context.loader]);

  return (
    <>
      {context.loader ? (
        <>
          <Head>
            <title>SrasMedias 🧦 | Productos</title>
          </Head>

          <div className={style.container}>
            <div className={style.container__productos}>
              {/* Menú para PC */}
              <ul className={style.menu}>
                <h3>Categorías</h3>
                <li
                  onClick={() => {
                    setProductosPublicos(context.productosPublicosCopia);
                    setBusqueda("");
                  }}
                >
                  Todo {`(${context.productosPublicosCopia.length})`}
                </li>
                <li
                  onClick={() => {
                    filtrarSeccionOfertas();
                    setBusqueda("");
                  }}
                >
                  Ofertas {`(${context.contadorOfert})`}
                </li>
                {categorias.map(({ tipoProducto, secciones }, i) => (
                  <div key={i}>
                    <h4>{tipoProducto}</h4>
                    {secciones.map((seccion, j) => (
                      <ItemMenuProductos
                        key={`${i}-${j}`}
                        funcion={() => filtrarSeccion(seccion, tipoProducto)}
                        item={seccion}
                        tipoProducto={tipoProducto}
                      />
                    ))}
                  </div>
                ))}
              </ul>

              {/* Menú para móvil */}
              <ul className={style.menu__movil}>
                <div className={style.movil__cat} onClick={mostrarMenu}>
                  <BiMenu className={style.cat__icon} /> <h3>Categorías</h3>
                </div>

                {showCategoria && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={style.buscador}
                  >
                    <li
                      onClick={() => {
                        setProductosPublicos(context.productosPublicosCopia);
                        setBusqueda("");
                        mostrarMenu();
                      }}
                    >
                      Todo {`(${context.productosPublicosCopia.length})`}
                    </li>
                    <li
                      onClick={() => {
                        filtrarSeccionOfertas();
                        setBusqueda("");
                        mostrarMenu();
                      }}
                    >
                      Ofertas {`(${context.contadorOfert})`}
                    </li>
                    {categorias.map(({ tipoProducto, secciones }, i) => (
                      <div key={i}>
                        <h4>{tipoProducto}</h4>
                        {secciones.map((seccion, j) => (
                          <ItemMenuProductos
                            key={`${i}-${j}`}
                            funcion={() =>
                              filtrarSeccion(seccion, tipoProducto)
                            }
                            item={seccion}
                            tipoProducto={tipoProducto}
                            click={mostrarMenu}
                          />
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </ul>

              <div className={style.tienda}>
                <ProductosTienda />
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Index;
