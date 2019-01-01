vec3 LightModel_Lambert(vec3 lightdir,vec3 lightColor,vec3 normal,vec3 albedo){
    float diff = max(.0,dot(-lightdir,normal));
    return albedo * lightColor * diff;
}


vec3 Sample_PointLight(vec3 wpos,uint index){
    LIGHT_DATA ldata = light_source[index];

    float dist = length(wpos - ldata.pos_type.xyz);

    return step(dist,9.0) * ldata.col_intensity.xyz;
}