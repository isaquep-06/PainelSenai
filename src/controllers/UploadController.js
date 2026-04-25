import cloudinary from "../config/cloudinary.js";

class UploadController {

  // UPLOAD
  async upload(req, res) {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          message: "Nenhum arquivo enviado",
        });
      }

      // salva como ativo por padrão
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "painel-senai",
        resource_type: file.mimetype.includes("video") ? "video" : "image",
        context: "active=true",
      });

      return res.status(201).json({
        message: "Upload realizado com sucesso",
        id: result.public_id,
        src: result.secure_url,
        active: true,
        type: result.resource_type,
      });

    } catch (error) {
      console.error("ERRO UPLOAD:", error);

      return res.status(500).json({
        message: "Erro ao fazer upload",
      });
    }
  }

  // LISTAR
  async getAll(req, res) {
    try {
      const [images, videos] = await Promise.all([
        cloudinary.api.resources({
          type: "upload",
          resource_type: "image",
          max_results: 100,
          context: true,
        }),
        cloudinary.api.resources({
          type: "upload",
          resource_type: "video",
          max_results: 100,
          context: true,
        }),
      ]);

      const all = [...images.resources, ...videos.resources];

      const midias = all
        .map((item) => {
          // 🔥 Cloudinary NÃO garante custom sempre dentro de "custom"
          const context = item.context || {};

          // suporta variações do Cloudinary
          const rawActive =
            context.custom?.active ??
            context.active ??
            item.context?.active;

          const active =
            rawActive === "true" ||
            rawActive === true ||
            rawActive === 1;

          return {
            id: item.public_id,
            type: item.resource_type,
            src: item.secure_url,
            active: Boolean(active),
            createdAt: item.created_at,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

      return res.json(midias);
    } catch (error) {
      console.error("ERRO CLOUDINARY:", error);

      return res.status(500).json({
        message: "Erro ao buscar mídias",
      });
    }
  }

  // ATUALIZAR STATUS
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { active } = req.body;

      if (!id) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      // 🔥 BUSCA FORÇANDO TODOS OS TIPOS
      let resource = null;

      try {
        resource = await cloudinary.api.resource(id, {
          resource_type: "image",
        });
      } catch (e) { }

      if (!resource) {
        try {
          resource = await cloudinary.api.resource(id, {
            resource_type: "video",
          });
        } catch (e) { }
      }

      if (!resource) {
        return res.status(404).json({
          message: "Mídia não encontrada no Cloudinary",
          debug: { id },
        });
      }

      const resourceType = resource.resource_type;

      // 🔥 ATUALIZAÇÃO CORRETA (sem reupload errado)
      await cloudinary.uploader.explicit(id, {
        type: "upload",
        resource_type: resourceType,
        context: {
          active: String(active),
        },
      });

      return res.json({
        message: "Status atualizado com sucesso",
        id,
        active: Boolean(active),
      });

    } catch (error) {
      console.error("ERRO STATUS:", error);

      return res.status(500).json({
        message: "Erro ao atualizar status",
        error: error.message,
      });
    }
  }
  // DELETE
  async delete(req, res) {
    try {
      const { id } = req.params;
      const { type } = req.query;

      await cloudinary.uploader.destroy(id, {
        resource_type: type || "image",
      });

      return res.json({
        message: "Arquivo deletado",
      });

    } catch (error) {
      console.error("ERRO DELETE:", error);

      return res.status(500).json({
        message: "Erro ao deletar",
      });
    }
  }
}

export default new UploadController();