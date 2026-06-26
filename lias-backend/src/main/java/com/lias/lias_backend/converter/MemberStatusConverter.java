package com.lias.lias_backend.converter;

import com.lias.lias_backend.entity.enums.MemberStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class MemberStatusConverter
        implements AttributeConverter<MemberStatus, String> {

    @Override
    public String convertToDatabaseColumn(MemberStatus attribute) {
        return attribute == null ? null : attribute.name().toLowerCase();
    }

    @Override
    public MemberStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : MemberStatus.valueOf(dbData.toUpperCase());
    }
}