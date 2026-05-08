import models from "../models/index.js";

const { SystemUpdateLog, User } = models;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export async function registerSystemUpdate({
  entityType,
  entityId,
  action,
  turno = null,
  turnos = [],
  userId = null,
}) {
  let username = null;

  if (userId) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "username"],
    });
    username = user?.username ?? null;
  }

  return SystemUpdateLog.create({
    entity_type: entityType,
    entity_id: entityId,
    action,
    turno,
    turnos,
    performed_by: userId,
    performed_by_username: username,
    occurred_at: new Date(),
  });
}

export async function getLatestSystemUpdate() {
  const latestUpdate = await SystemUpdateLog.findOne({
    order: [["occurred_at", "DESC"]],
  });

  if (!latestUpdate) {
    return null;
  }

  const occurredAt = latestUpdate.occurred_at;

  return {
    id: latestUpdate.id,
    entity_type: latestUpdate.entity_type,
    entity_id: latestUpdate.entity_id,
    action: latestUpdate.action,
    turno: latestUpdate.turno,
    turnos: latestUpdate.turnos,
    updated_by: latestUpdate.performed_by_username,
    updated_by_id: latestUpdate.performed_by,
    occurred_at: occurredAt,
    occurred_at_iso: occurredAt.toISOString(),
    timezone: "America/Sao_Paulo",
    data: dateFormatter.format(occurredAt),
    horario: timeFormatter.format(occurredAt),
  };
}
